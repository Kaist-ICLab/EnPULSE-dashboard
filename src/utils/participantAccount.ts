import { AccountCsvRow, CsvRowStatus } from "@/types/account";

// Supabase Auth rejects passwords shorter than this unless the server is configured otherwise.
export const MIN_ACCOUNT_PASSWORD_LENGTH = 6;

// Deliberately loose: Supabase Auth does the real check. This only catches obvious typos
// before the request. The address does not need a real inbox, since the account is created
// already confirmed.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeAccountEmail = (email: string): string => email.trim().toLowerCase();

/** Returns a message describing what is wrong with the new account's details, or null if they are usable. */
export function validateNewAccount(email: string, password: string): string | null {
  const normalized = normalizeAccountEmail(email);
  if (normalized.length === 0) return "Enter an email address.";
  if (!EMAIL_PATTERN.test(normalized)) return "Enter a valid email address, such as p001@example.com.";
  if (password.length < MIN_ACCOUNT_PASSWORD_LENGTH)
    return `The password must be at least ${MIN_ACCOUNT_PASSWORD_LENGTH} characters.`;
  return null;
}

export const ACCOUNT_CSV_TEMPLATE = "email,password\np001@example.com,change-me-1\n";

/**
 * Reads accounts from CSV rows (see parseCsv). The first row must be a header with "email"
 * and "password" columns, in any order and case; other columns are ignored. Each row is
 * checked like a manually entered account, and repeated emails within the file are flagged.
 * Throws when the header is missing, since then no row can be read.
 */
export function readAccountCsv(rows: string[][]): AccountCsvRow[] {
  if (rows.length === 0) throw new Error("The file is empty.");
  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const emailColumn = header.indexOf("email");
  const passwordColumn = header.indexOf("password");
  if (emailColumn === -1 || passwordColumn === -1)
    throw new Error('The first row must be a header with "email" and "password" columns.');

  const seen = new Set<string>();
  return rows.slice(1).map((cells, index) => {
    const email = normalizeAccountEmail(cells[emailColumn] ?? "");
    const password = cells[passwordColumn] ?? "";
    let error = validateNewAccount(email, password);
    if (!error && seen.has(email)) error = "This email appears earlier in the file.";
    seen.add(email);
    return { line: index + 2, email, password, error };
  });
}

/** Where a row starts before an import: ready, or marked with why it can't be created. */
export const initialCsvRowStatus = (row: AccountCsvRow): CsvRowStatus =>
  row.error ? { state: "invalid", message: row.error } : { state: "ready" };
