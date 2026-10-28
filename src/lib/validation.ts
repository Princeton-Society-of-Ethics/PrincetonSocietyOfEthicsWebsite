/**
 * Format checks for contact fields. Each `...Error` function returns "" when
 * the value is acceptable (or empty, which `required` handles separately) and
 * a short, human message otherwise, ready for `setCustomValidity`.
 */

/** Digits of a U.S. phone number, without a leading country code 1. */
export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function phoneError(value: string): string {
  if (!value.trim()) return "";
  const digits = phoneDigits(value);
  if (digits.length !== 10) return "Enter a 10-digit U.S. phone number, like (609) 555-0123.";
  // North American numbers: area code and exchange can't start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]/.test(digits)) {
    return "That doesn't look like a valid U.S. phone number. Check the area code.";
  }
  return "";
}

/** "6095550123" → "(609) 555-0123"; anything that isn't a valid number is left as typed. */
export function formatPhone(value: string): string {
  if (phoneError(value)) return value;
  const d = phoneDigits(value);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Stricter than type="email", which accepts addresses with no domain ending (a@b). */
const EMAIL_PATTERN = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function emailError(value: string): string {
  if (!value.trim()) return "";
  return EMAIL_PATTERN.test(value.trim())
    ? ""
    : "Enter a complete email address, like coach@school.org.";
}

const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "iclod.com": "icloud.com",
  "icloud.co": "icloud.com",
};

/** A corrected address when the domain looks like a common typo, otherwise null. */
export function emailSuggestion(value: string): string | null {
  const [local, domain, ...rest] = value.trim().split("@");
  if (!local || !domain || rest.length) return null;
  const fix = DOMAIN_TYPOS[domain.toLowerCase()];
  return fix ? `${local}@${fix}` : null;
}
