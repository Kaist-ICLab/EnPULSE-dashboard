import { DownloadFileRow } from "@/types/download";
import { ResponseStatus } from "@/types/response";
import dayjs from "dayjs";
import { Spinner } from "flowbite-react";
import { Modal } from "../common/Modal";

const PreviewDataModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedRow: DownloadFileRow | null;
  previewStatus: ResponseStatus;
  previewData: Record<string, unknown>[];
}> = ({ isOpen, onClose, selectedRow, previewStatus, previewData }) => {
  const keySet = new Set<string>();
  previewData.forEach((row) => {
    Object.keys(row).forEach((key) => keySet.add(key));
  });
  const columns = Array.from(keySet);

  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      title={`Preview: ${selectedRow?.table} / ${selectedRow?.uuid} / ${dayjs(selectedRow?.date).format("YYYY-MM-DD")}`}
      className="max-h-[80vh] w-full max-w-6xl"
    >
      <div className="flex-1 overflow-auto p-4">
        {previewStatus === "loading" ? (
          <div className="flex min-h-40 w-full items-center justify-center">
            <Spinner />
          </div>
        ) : previewData.length === 0 ? (
          <div className="flex min-h-24 w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500">
            No preview data available for this selection.
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 text-left font-medium whitespace-nowrap text-gray-700">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column) => (
                      <td key={`${rowIndex}-${column}`} className="px-3 py-2 whitespace-nowrap text-gray-900">
                        {String(row[column] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PreviewDataModal;
