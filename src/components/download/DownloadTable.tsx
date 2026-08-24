import PreviewDataModal from "@/components/download/PreviewDataModal";
import useDownloadListState from "@/hooks/download/useDownloadListState";
import useDownloadState from "@/stores/downloadStore";
import { DownloadFileRow } from "@/types/download";
import dayjs from "dayjs";
import { Card, Checkbox, Spinner } from "flowbite-react";
import { useState } from "react";
import IconButton from "../common/IconButton";

export const DownloadTable = () => {
  const { downloadListStatus } = useDownloadState();
  const {
    selectedPreviewRow,
    previewStatus,
    previewData,
    selectedDataCount,
    isSomethingDownloading,
    generatePreviewData,
    downloadData,
    downloadAllData,
  } = useDownloadListState();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="max-w-3xl">
        <h6 className="text-xl font-semibold text-gray-900">Download Data</h6>
        <div className="relative">
          {downloadListStatus === "loading" && (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm">
              <Spinner />
            </div>
          )}
          <DownloadTableContent
            selectedDataCount={selectedDataCount}
            generatePreviewData={(row) => {
              generatePreviewData(row);
              setIsPreviewOpen(true);
            }}
            downloadData={downloadData}
            downloadAllData={downloadAllData}
            isSomethingDownloading={isSomethingDownloading}
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
  );
};

const DownloadTableContent: React.FC<{
  selectedDataCount: number;
  generatePreviewData: (row: DownloadFileRow) => void;
  downloadData: (idx: number, row: DownloadFileRow) => void;
  downloadAllData: () => void;
  isSomethingDownloading: boolean;
}> = ({ selectedDataCount, generatePreviewData, downloadData, downloadAllData, isSomethingDownloading }) => {
  const { downloadList, downloadListStatus, toggleDownloadListItemChecked, setAllDownloadListItemsChecked } =
    useDownloadState();

  if (downloadListStatus === null) {
    return (
      <div className="flex min-h-24 w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500">
        Please generate download list first.
      </div>
    );
  }
  if (downloadList.length === 0) {
    return (
      <div className="mt-4">
        <h6 className="mb-2 text-sm font-semibold text-gray-900">Generated files (0)</h6>
      </div>
    );
  } else {
    return (
      <div className="">
        <div className="mb-2 flex h-10 items-center justify-between gap-4 rounded-lg bg-gray-200 px-4">
          <h6 className="text-sm font-semibold text-gray-900">
            {selectedDataCount > 0
              ? `${selectedDataCount} File${selectedDataCount > 1 ? "s" : ""} selected`
              : `${downloadList.length} File${downloadList.length > 1 ? "s" : ""} generated`}
          </h6>
          {selectedDataCount > 0 && (
            <IconButton
              onClick={downloadAllData}
              hoverColor="gray"
              size="lg"
              className="icon-[material-symbols--download]"
              disabled={isSomethingDownloading}
            />
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="flex items-center justify-center px-2 py-2.5">
                  <Checkbox
                    checked={selectedDataCount === downloadList.length}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAllDownloadListItemsChecked(selectedDataCount !== downloadList.length);
                    }}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">PID</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Sensor table</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Rows</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {downloadList.map((row, idx) => (
                <tr key={idx} onClick={() => toggleDownloadListItemChecked(idx)}>
                  <td className="flex items-center justify-center px-2 py-2.5">
                    <Checkbox
                      checked={row.isChecked}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDownloadListItemChecked(idx);
                      }}
                      onChange={() => {}}
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-900">P{row.pid}</td>
                  <td className="px-3 py-2 text-gray-900">{row.table}</td>
                  <td className="px-3 py-2 text-gray-900">{dayjs(row.date).format("YYYY-MM-DD")}</td>
                  <td className="px-3 py-2 text-gray-900">{row.count}</td>
                  <td className="px-3 py-2">
                    {row.count > 0 && (
                      <div className="flex items-center gap-2">
                        {row.downloadStatus === null ? (
                          <IconButton
                            onClick={() => downloadData(idx, row)}
                            hoverColor="gray"
                            className="icon-[material-symbols--download]"
                            disabled={row.count === 0}
                          />
                        ) : row.downloadStatus === "loading" ? (
                          <Spinner size="sm" />
                        ) : row.downloadStatus === "ok" ? (
                          <span className="icon-[material-symbols--check] text-blue-500"></span>
                        ) : (
                          <span className="icon-[humbleicons--times]"></span>
                        )}

                        <IconButton
                          onClick={() => generatePreviewData(row)}
                          hoverColor="gray"
                          className="icon-[mdi--eye]"
                          disabled={row.count === 0}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};
