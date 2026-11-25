import { triggerFileDownload } from "@/utils/download";
import { ACCOUNT_CSV_TEMPLATE } from "@/utils/participantAccount";

const downloadTemplate = () =>
  triggerFileDownload(new Blob([ACCOUNT_CSV_TEMPLATE], { type: "text/csv" }), "accounts-template.csv");

/** Describes the expected CSV columns and offers a template file. */
const CsvFormatNotice: React.FC = () => (
  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
    The first row must be a header with <code>email</code> and <code>password</code> columns. Other columns are ignored.{" "}
    <button type="button" className="text-blue-600 hover:underline" onClick={downloadTemplate}>
      Download a template
    </button>
  </div>
);

export default CsvFormatNotice;
