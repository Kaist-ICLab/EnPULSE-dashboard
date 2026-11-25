import { CampaignParticipant } from "./campaign";
import { DeepRequired } from "@/utils/type";

/** A participant as loaded with the campaign (a row of `profiles`). */
export type Participant = DeepRequired<CampaignParticipant>;

/** Sign-in details of a Supabase Auth user. Profiles do not store these. */
export interface AuthAccountInfo {
  createdAt: string;
  lastSignInAt: string | null;
}

/** How a researcher adds accounts: one at a time, or from a CSV file. */
export type AddAccountMode = "manual" | "csv";

export interface AccountCsvRow {
  /** Row number in the file, counting the header as row 1. Blank lines are not counted. */
  line: number;
  email: string;
  password: string;
  /** Why this row can't be created, or null if it can. */
  error: string | null;
}

/** Progress of one CSV row through an import. */
export type CsvRowStatus =
  | { state: "invalid"; message: string }
  | { state: "ready" }
  | { state: "creating" }
  | { state: "created"; pid: number }
  | { state: "failed"; message: string };

export type CsvImportPhase = "select" | "running" | "done";
