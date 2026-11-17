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

/**
 * Parses CSV text into rows of cells (RFC 4180: quoted cells may hold commas, line breaks
 * and doubled quotes). Accepts \n and \r\n line endings and drops a leading byte order mark,
 * which Excel adds when saving as "CSV UTF-8". Lines with no content are skipped.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const input = text.startsWith("﻿") ? text.slice(1) : text;

  const endRow = () => {
    row.push(cell);
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
    cell = "";
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"' && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      endRow();
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length > 0) endRow();
  return rows;
}
