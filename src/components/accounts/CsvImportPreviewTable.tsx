import { AccountCsvRow, CsvRowStatus } from "@/types/account";
import CsvRowStatusCell from "./CsvRowStatusCell";

/** The rows of an account CSV with each one's status. Passwords are not shown. */
const CsvImportPreviewTable: React.FC<{ rows: AccountCsvRow[]; statuses: CsvRowStatus[] }> = ({ rows, statuses }) => (
  <div className="min-h-0 overflow-auto rounded-lg border border-gray-200">
    <table className="w-full text-left text-sm text-gray-600">
      <thead className="sticky top-0 bg-gray-100 text-xs text-gray-700 uppercase">
        <tr>
          <th className="px-3 py-2">Row</th>
          <th className="px-3 py-2">Email</th>
          <th className="px-3 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.line} className="border-t border-gray-100">
            <td className="px-3 py-2">{row.line}</td>
            <td className="px-3 py-2 font-medium text-gray-900">{row.email || "-"}</td>
            <td className="px-3 py-2">
              <CsvRowStatusCell status={statuses[index]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CsvImportPreviewTable;
