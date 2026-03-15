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
        <Modal onClose={onClose} title={`Preview: ${selectedRow?.table} / ${selectedRow?.uuid} / ${dayjs(selectedRow?.date).format("YYYY-MM-DD")}`} className="w-full max-w-6xl max-h-[80vh]">
            <div className="p-4 flex-1 overflow-auto">
                {previewStatus === "loading" ? (
                    <div className="w-full min-h-40 flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : previewData.length === 0 ? (
                    <div className="w-full min-h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        No preview data available for this selection.
                    </div>
                ) : (
                    <div className="overflow-auto max-h-[60vh] rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column} className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {previewData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((column) => (
                                            <td key={`${rowIndex}-${column}`} className="px-3 py-2 text-gray-900 whitespace-nowrap">
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
