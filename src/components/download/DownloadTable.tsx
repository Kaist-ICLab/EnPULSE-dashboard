import { DownloadFileRow } from "@/types/download";
import { ResponseStatus } from "@/types/response";
import dayjs from "dayjs";
import { Button, Card, Spinner } from "flowbite-react";

export const DownloadTable: React.FC<{
    status: ResponseStatus;
    previewRows: DownloadFileRow[];
    downloadData: (row: DownloadFileRow) => void;
}> = ({ status, previewRows, downloadData }) => {
    return (
        <Card className="max-w-3xl">
            <h6 className="text-xl font-semibold text-gray-900">Download Data</h6>
            <div className="relative">
                {status === "loading" && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                        <Spinner />
                    </div>
                )}
                <DownloadTableContent status={status} previewRows={previewRows} downloadData={downloadData} />
            </div>

        </Card>
    )
}

const DownloadTableContent: React.FC<{
    status: ResponseStatus;
    previewRows: DownloadFileRow[];
    downloadData: (row: DownloadFileRow) => void;
}> = ({ status, previewRows, downloadData }) => {
    if (status === null) {
        return (
            <div className="w-full min-h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                Please generate download list first.
            </div>
        )
    }
    if (previewRows.length === 0) {
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
                    Generated files ({previewRows.length})
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
                            {previewRows.map((row, idx) => (
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
                                                <Button
                                                    size="xs"
                                                    disabled={row.count === 0}
                                                    onClick={() => downloadData(row)}
                                                >
                                                    <span className="icon-[material-symbols--download] w-4 h-4" />
                                                </Button>
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