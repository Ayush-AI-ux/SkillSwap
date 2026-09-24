// Strict-ish format: local part, one @, domain with at least one dot and a 2+ letter TLD
const STRICT =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  if (email.includes("..")) return false;
  const [local] = email.split("@");
  if (!local || local.startsWith(".") || local.endsWith(".")) return false;
  return STRICT.test(email);
}

// Common misspellings -> the domain the person probably meant
const TYPO_DOMAINS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gamil.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "yahho.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "icloud.con": "icloud.com",
};

export function suggestEmail(email: string): string | null {
  const [local, domain] = email.split("@");
  if (!local || !domain) return null;
  const fix = TYPO_DOMAINS[domain.toLowerCase()];
  return fix ? `${local}@${fix}` : null;
}