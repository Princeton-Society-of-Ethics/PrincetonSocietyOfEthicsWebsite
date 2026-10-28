/**
 * NJ High School Ethics Bowl: team registration receiver (Google Apps Script).
 *
 * The website's /register form POSTs each registration here, and this script
 * appends it as a row in the Google Sheet it is attached to.
 *
 * ONE-TIME SETUP (about 5 minutes)
 *   1. Create a Google Sheet, e.g. "NJHSEB Registrations 2026–2027".
 *   2. In the sheet: Extensions → Apps Script. Delete the starter code and
 *      paste in this entire file. Optionally fill in NOTIFY_EMAILS below. Save.
 *   3. Deploy → New deployment → gear icon → "Web app".
 *        Execute as:     Me
 *        Who has access: Anyone
 *      Click Deploy and approve the permissions prompt (Google warns that the
 *      app is unverified; choose Advanced → Go to project).
 *   4. Copy the Web app URL (ends in /exec) into `submitUrl` in
 *      src/content/ethicsBowlRegistration.ts, then commit and deploy the site.
 *   5. Test: open the /exec URL in a browser and you should see {"ok":true,...}.
 *      Then submit a test registration on the site and delete its row.
 *
 * If you edit this script later, publish the change with Deploy → Manage
 * deployments → Edit (pencil) → Version: New version. That keeps the same URL.
 * Creating a brand-new deployment gives a new URL that the site won't know about.
 *
 * Each new season, either clear the old rows or make a fresh copy of the sheet
 * (File → Make a copy copies the script too, but you must deploy it again and
 * update `submitUrl`).
 */

/** Tab the rows are written to; created automatically if it doesn't exist. */
const SHEET_NAME = "Registrations";

/**
 * Optional: comma-separated addresses to email whenever a team registers,
 * e.g. "president@princeton.edu, ethicsbowl@princeton.edu". Leave "" for none.
 */
const NOTIFY_EMAILS = "";

/** Sheet columns, in order: [header, key in the submitted JSON]. */
const COLUMNS = [
  ["Season", "season"],
  ["School", "schoolName"],
  ["School Town", "schoolCity"],
  ["School In NJ Directory", "schoolVerified"],
  ["Coach Name", "coachName"],
  ["Coach Cell Phone", "coachPhone"],
  ["Coach Email", "coachEmail"],
  ["Team Roster", "roster"],
  ["Dietary Restrictions / Allergies", "dietaryRestrictions"],
  ["Additional Guests", "additionalGuests"],
  ["Additional Teams", "additionalTeams"],
  ["Confirmed Participation", "confirmed"],
];

const REQUIRED_KEYS = [
  "schoolName",
  "schoolCity",
  "coachName",
  "coachPhone",
  "coachEmail",
  "roster",
  "dietaryRestrictions",
  "additionalGuests",
  "additionalTeams",
];

/** Health check: visiting the /exec URL in a browser shows that it's live. */
function doGet() {
  return json({ ok: true, status: "Ethics Bowl registration endpoint is live." });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: bots fill in the hidden "website" field. Pretend it worked.
    if (data.website) return json({ ok: true });

    const missing = REQUIRED_KEYS.filter((key) => !String(data[key] || "").trim());
    if (missing.length > 0 || data.confirmed !== true) {
      return json({ ok: false, error: "Missing required fields: " + missing.join(", ") });
    }
    // Same format rules as the website (src/lib/validation.ts).
    if (!isValidPhone(data.coachPhone) || !isValidEmail(data.coachEmail)) {
      return json({ ok: false, error: "Invalid phone number or email address." });
    }

    lock.waitLock(10000);
    const sheet = getSheet();
    const row = [new Date()].concat(
      COLUMNS.map(([, key]) => {
        if (key === "confirmed") return "Yes";
        if (key === "schoolVerified")
          return data.schoolVerified === true ? "Yes" : "No — please verify";
        return clean(data[key]);
      })
    );
    sheet.appendRow(row);
    lock.releaseLock();

    notify(data);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "Could not save registration." });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/** 10-digit U.S. number (optional leading 1); area code and exchange can't start with 0 or 1. */
function isValidPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}

function isValidEmail(value) {
  return /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(
    String(value || "").trim()
  );
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    const headers = ["Submitted At"].concat(COLUMNS.map(([header]) => header));
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Trim and cap a submitted value, and stop text that starts with = + - @ from
 * being run as a spreadsheet formula.
 */
function clean(value) {
  const text = String(value == null ? "" : value)
    .trim()
    .slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function notify(data) {
  if (!NOTIFY_EMAILS) return;
  try {
    const body = COLUMNS.map(([header, key]) => header + ":\n" + clean(data[key]) + "\n").join(
      "\n"
    );
    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: "New Ethics Bowl registration: " + clean(data.schoolName),
      body: body + "\nAll registrations: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      replyTo: clean(data.coachEmail),
    });
  } catch (err) {
    // The row is already saved; a failed email shouldn't fail the registration.
    console.error(err);
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
