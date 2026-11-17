import { Button, Spinner } from "flowbite-react";
import { Modal } from "@/components/common/Modal";
import useCsvAccountImport from "@/hooks/accounts/useCsvAccountImport";
import AccountSignInHint from "./AccountSignInHint";
import CsvFilePicker from "./CsvFilePicker";
import CsvFormatNotice from "./CsvFormatNotice";
import CsvImportPreviewTable from "./CsvImportPreviewTable";

const CsvAccountModal: React.FC<{
  onClose: () => void;
  onCreated: () => Promise<void>;
}> = ({ onClose, onCreated }) => {
  const { fileName, rows, statuses, fileError, phase, readyCount, createdCount, problemCount, readFile, createAll } =
    useCsvAccountImport(onCreated);

  const summary =
    phase === "select"
      ? `${readyCount} ready${problemCount > 0 ? `, ${problemCount} will be skipped` : ""}`
      : `${createdCount} created${problemCount > 0 ? `, ${problemCount} not created` : ""}`;

  return (
    <Modal
      onClose={() => phase !== "running" && onClose()}
      title="Import Accounts from CSV"
      className="max-h-full w-full max-w-2xl"
    >
      <div className="flex min-h-0 flex-col gap-4 p-5">
        <AccountSignInHint />
        <CsvFormatNotice />
        {phase === "select" && <CsvFilePicker fileName={fileName} onSelect={readFile} />}
        {fileError && <p className="text-sm text-red-600">{fileError}</p>}
        {rows && <CsvImportPreviewTable rows={rows} statuses={statuses} />}

        <div className="flex items-center justify-end gap-2">
          {rows && <span className="mr-auto text-sm text-gray-500">{summary}</span>}
          {phase === "done" ? (
            <Button onClick={onClose}>Done</Button>
          ) : (
            <>
              <Button color="gray" onClick={onClose} disabled={phase === "running"}>
                Cancel
              </Button>
              <Button onClick={createAll} disabled={phase === "running" || readyCount === 0}>
                {phase === "running" && <Spinner size="sm" className="mr-2" />}
                {`Create ${readyCount} account${readyCount === 1 ? "" : "s"}`}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CsvAccountModal;
