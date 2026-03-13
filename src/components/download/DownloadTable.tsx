import { DownloadFileRow } from "@/types/download";
import { ResponseStatus } from "@/types/response";
import PreviewDataModal from "@/components/download/PreviewDataModal";
import dayjs from "dayjs";
import { Card, Spinner } from "flowbite-react";
import { useState } from "react";
import IconButton from "../common/IconButton";

export const DownloadTable: React.FC<{
    status: ResponseStatus;
    downloadFiles: DownloadFileRow[];
    previewStatus: ResponseStatus;
    selectedPreviewRow: DownloadFileRow | null;
    previewData: Record<string, unknown>[];
    generatePreviewData: (row: DownloadFileRow) => void;
    downloadData: (row: DownloadFileRow) => void;
}> = ({ status, downloadFiles, previewStatus, selectedPreviewRow, previewData, generatePreviewData, downloadData }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <>
            <Card className="max-w-3xl">
                <h6 className="text-xl font-semibold text-gray-900">Download Data</h6>
                <div className="relative">
                    {status === "loading" && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                            <Spinner />
                        </div>
                    )}
                    <DownloadTableContent
                        status={status}
                        previewStatus={previewStatus}
                        generatePreviewData={(row) => { generatePreviewData(row); setIsPreviewOpen(true); }}
                        downloadFiles={downloadFiles}
                        downloadData={downloadData}
                    />
                </div>
            </Card>

            <PreviewDataModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                selectedRow={selectedPreviewRow}
                previewStatus={previewStatus}
                previewData={previewData}
            />
        </>
    )
}

const DownloadTableContent: React.FC<{
    status: ResponseStatus;
    previewStatus: ResponseStatus;
    generatePreviewData: (row: DownloadFileRow) => void;
    downloadFiles: DownloadFileRow[];
    downloadData: (row: DownloadFileRow) => void;
}> = ({ status, generatePreviewData, downloadFiles, downloadData }) => {
    if (status === null) {
        return (
            <div className="w-full min-h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                Please generate download list first.
            </div>
        )
    }
    if (downloadFiles.length === 0) {
        return (
            <div className="mt-4">
                <h6 className="mb-2 text-sm font-semibold text-gray-900">
                    Generated files (0)
                </h6>
            </div>
        )
    } else {
        return (
            <div className="mt-4">
                <h6 className="mb-2 text-sm font-semibold text-gray-900">
                    Generated files ({downloadFiles.length})
                </h6>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Participant</th>
                                {/* <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th> */}
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Sensor table</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Rows</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {downloadFiles.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 py-2 font-mono text-xs text-gray-900">
                                        {row.uuid}
                                    </td>
                                    {/* <td className="px-3 py-2 text-gray-900">{row.email}</td> */}
                                    <td className="px-3 py-2 text-gray-900">{row.table}</td>
                                    <td className="px-3 py-2 text-gray-900">{dayjs(row.date).format('YYYY-MM-DD')}</td>
                                    <td className="px-3 py-2 text-gray-900">{row.count}</td>
                                    <td className="px-3 py-2">
                                        {
                                            row.count > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <IconButton
                                                        onClick={() => downloadData(row)}
                                                        hoverColor="gray"
                                                        className="icon-[material-symbols--download]"
                                                        disabled={row.count === 0}
                                                    />
                                                    <IconButton
                                                        onClick={() => generatePreviewData(row)}
                                                        hoverColor="gray"
                                                        className="icon-[mdi--eye]"
                                                        disabled={row.count === 0}
                                                    />
                                                </div>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}