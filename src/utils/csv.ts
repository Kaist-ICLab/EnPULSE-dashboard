// Spreadsheets run a cell as a formula when it starts with one of these, even after spaces.
const FORMULA_START = /^\s*[=+\-@]|^[\t\r]/;

// Sensor values such as -12.5 or 1e-5 start with the same characters, but are safe and must
// stay as they are, or exported numbers would turn into text.
const PLAIN_NUMBER = /^[+-]?(?:Infinity|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)$/;

/**
 * Prepares one value for a CSV cell. Exported values come from participants' devices, so a
 * value that could run as a formula gets a leading apostrophe, which makes spreadsheets
 * treat it as text.
 */
export function csvEscape(value: string): string {
  const safe = FORMULA_START.test(value) && !PLAIN_NUMBER.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}
