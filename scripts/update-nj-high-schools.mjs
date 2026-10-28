#!/usr/bin/env node
/**
 * Rebuilds public/data/nj-high-schools.json: every open New Jersey school that
 * teaches 12th grade, used by the Ethics Bowl registration form to make sure
 * coaches pick a real school.
 *
 * Sources (both from the U.S. Department of Education, NCES):
 *   - Public and charter schools: Common Core of Data school directory, via the
 *     Urban Institute Education Data API (https://educationdata.urban.org).
 *   - Private schools: Private School Survey public-use file
 *     (https://nces.ed.gov/surveys/pss/pssdata.asp).
 *
 * Usage (needs `unzip` on your PATH, standard on macOS and Linux):
 *   node scripts/update-nj-high-schools.mjs [ccdYear] [pssFile]
 * e.g.
 *   node scripts/update-nj-high-schools.mjs 2023 pss2324_pu_csv
 *
 * Check https://educationdata.urban.org/documentation/schools.html for the
 * newest CCD year and the NCES PSS page for the newest file name.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CCD_YEAR = process.argv[2] ?? "2023";
const PSS_FILE = process.argv[3] ?? "pss2324_pu_csv";
const OUTPUT = new URL("../public/data/nj-high-schools.json", import.meta.url);

const NJ_FIPS = 34;
/** CCD school_status codes for schools that are operating. */
const OPEN_STATUSES = new Set([1, 3, 4, 5, 8]);
/** Some hosts reject fetch's default user agent, so identify ourselves plainly. */
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (njhseb-school-list-updater; +https://github.com/Princeton-Society-of-Ethics)",
};
/** PSS grade code for 12th grade (1 = ungraded, 2 = pre-K, 3 = K, 4 = TK, 5 = T1, 6 = 1st, … 17 = 12th). */
const PSS_GRADE_12 = 17;

async function publicSchools() {
  const url = `https://educationdata.urban.org/api/v1/schools/ccd/directory/${CCD_YEAR}/?fips=${NJ_FIPS}`;
  const schools = [];
  for (let next = url; next;) {
    const response = await fetch(next, { headers: HEADERS });
    if (!response.ok) throw new Error(`CCD request failed: ${response.status} ${next}`);
    const page = await response.json();
    schools.push(...page.results);
    next = page.next;
  }
  return schools
    .filter(
      (s) =>
        OPEN_STATUSES.has(s.school_status) &&
        s.highest_grade_offered === 12 &&
        s.lowest_grade_offered <= 12
    )
    .map((s) => ({
      name: tidyName(s.school_name),
      city: titleCase(s.city_location),
      type: s.charter === 1 ? "Charter" : "Public",
    }));
}

async function privateSchools() {
  const workDir = mkdtempSync(join(tmpdir(), "pss-"));
  try {
    const zipPath = join(workDir, `${PSS_FILE}.zip`);
    const response = await fetch(`https://nces.ed.gov/surveys/pss/zip/${PSS_FILE}.zip`, {
      headers: HEADERS,
    });
    if (!response.ok) throw new Error(`PSS download failed: ${response.status}`);
    writeFileSync(zipPath, Buffer.from(await response.arrayBuffer()));
    execFileSync("unzip", ["-q", "-o", zipPath, "-d", workDir]);

    const csvName = readdirSync(workDir).find((f) => f.toLowerCase().endsWith(".csv"));
    if (!csvName) throw new Error("No CSV found in the PSS download");
    const [header, ...rows] = parseCsv(readFileSync(join(workDir, csvName), "latin1"));
    const col = (name) => {
      const index = header.findIndex((h) => h === name || h.startsWith(name));
      if (index === -1) throw new Error(`PSS column ${name} not found`);
      return index;
    };
    const [iName, iCity, iState, iHigh] = [col("PINST"), col("PCITY"), col("PSTABB"), col("HIGR")];

    return rows
      .filter((r) => r[iState] === "NJ" && Number(r[iHigh]) === PSS_GRADE_12)
      .map((r) => ({ name: tidyName(r[iName]), city: titleCase(r[iCity]), type: "Private" }));
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') ((field += '"'), i++);
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") (row.push(field), (field = ""));
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      (row.push(field), rows.push(row), (row = []), (field = ""));
    } else field += c;
  }
  if (field || row.length) (row.push(field), rows.push(row));
  return rows;
}

const SMALL_WORDS = new Set(["a", "an", "and", "at", "for", "in", "of", "on", "the", "to"]);
const UPPER_WORDS = new Set([
  "II",
  "III",
  "IV",
  "STEM",
  "MET",
  "KIPP",
  "YMCA",
  "LEAP",
  "HS",
  "JFK",
]);

/** Abbreviations in the federal files, expanded for display. */
const EXPANSIONS = [
  [/\bSchl\b/g, "School"],
  [/\bCo\b/g, "County"],
  [/\b(Jdc|Cpc|Nj|Esc|Ctc)\b/g, (abbr) => abbr.toUpperCase()],
  // The PSS file drops apostrophes: "GILL ST BERNARD S SCHOOL" → "Bernard's"
  [/(\w) S\b/g, "$1's"],
];

/** "ST JOSEPH HIGH SCHOOL" → "St. Joseph High School"; mixed-case names keep their casing. */
function tidyName(raw) {
  const name = raw.trim().replace(/\s+/g, " ");
  const cased = name === name.toUpperCase() ? titleCase(name) : name;
  return EXPANSIONS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    cased
  );
}

function titleCase(raw) {
  return raw
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      const upper = word.toUpperCase();
      if (UPPER_WORDS.has(upper)) return upper;
      if (index > 0 && SMALL_WORDS.has(word)) return word;
      if (word === "st") return "St.";
      // Capitalize after hyphens, slashes, apostrophes and Mc (e.g. Mary-Help, O'Neill,
      // McCorristin), but not a possessive 's
      return word
        .replace(/(^|[-/(]|'(?=[a-z]{2}))([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase())
        .replace(/^Mc([a-z])/, (_, ch) => "Mc" + ch.toUpperCase());
    })
    .join(" ");
}

const all = [...(await publicSchools()), ...(await privateSchools())];
const seen = new Set();
const schools = all
  .filter((s) => {
    const key = `${s.name}|${s.city}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => a.name.localeCompare(b.name) || a.city.localeCompare(b.city));

writeFileSync(
  OUTPUT,
  JSON.stringify(
    {
      source: `NCES Common Core of Data ${CCD_YEAR} (public/charter) and Private School Survey ${PSS_FILE} (private)`,
      generated: new Date().toISOString().slice(0, 10),
      schools,
    },
    null,
    0
  ) + "\n"
);
const counts = schools.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] ?? 0) + 1 }), {});
console.log(`Wrote ${schools.length} schools`, counts);
