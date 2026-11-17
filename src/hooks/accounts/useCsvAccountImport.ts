import { useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { createCampaignAccount } from "@/services/accountService";
import { AccountCsvRow, CsvImportPhase, CsvRowStatus } from "@/types/account";
import { parseCsv } from "@/utils/csv";
import { initialCsvRowStatus, readAccountCsv } from "@/utils/participantAccount";

/** State of the "Import from CSV" dialog: read a file, preview its rows, then create them. */
export default function useCsvAccountImport(onCreated: () => Promise<void>) {
  const campaignId = useCampaignStore((state) => state.campaign?.id);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<AccountCsvRow[] | null>(null);
  const [statuses, setStatuses] = useState<CsvRowStatus[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [phase, setPhase] = useState<CsvImportPhase>("select");

  const readFile = async (file: File) => {
    setFileName(file.name);
    try {
      const parsed = readAccountCsv(parseCsv(await file.text()));
      if (parsed.length === 0) throw new Error("The file has a header but no accounts.");
      setRows(parsed);
      setStatuses(parsed.map(initialCsvRowStatus));
      setFileError(null);
    } catch (err) {
      setRows(null);
      setFileError(err instanceof Error ? err.message : "Could not read the file.");
    }
  };

  const setStatus = (index: number, status: CsvRowStatus) =>
    setStatuses((prev) => prev.map((s, i) => (i === index ? status : s)));

  // One at a time, so PIDs follow the file's order and a slow backend isn't flooded.
  const createAll = async () => {
    if (!rows || campaignId === undefined) return;
    setPhase("running");
    let created = 0;
    for (const [index, row] of rows.entries()) {
      if (row.error) continue;
      setStatus(index, { state: "creating" });
      try {
        const pid = await createCampaignAccount(campaignId, row.email, row.password);
        setStatus(index, { state: "created", pid });
        created++;
      } catch (err) {
        setStatus(index, { state: "failed", message: err instanceof Error ? err.message : "Failed." });
      }
    }
    if (created > 0) await onCreated();
    setPhase("done");
  };

  return {
    fileName,
    rows,
    statuses,
    fileError,
    phase,
    readyCount: statuses.filter((s) => s.state === "ready").length,
    createdCount: statuses.filter((s) => s.state === "created").length,
    problemCount: statuses.filter((s) => s.state === "invalid" || s.state === "failed").length,
    readFile,
    createAll,
  };
}
