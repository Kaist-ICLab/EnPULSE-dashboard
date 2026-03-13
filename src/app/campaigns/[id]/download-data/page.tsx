"use client";

import { DownloadTable } from "@/components/download/DownloadTable";
import DownloadedDataConfig from "@/components/download/DownloadedDataConfig";
import useDownloadState from "@/hooks/useDownloadState";

const Page = () => {
    const { status,
        isDownloadingAll,
        previewStatus,
        selectedPreviewRow,
        selectedParticipantIds,
        setSelectedParticipantIds,
        selectedFieldIds,
        setSelectedFieldIds,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        generateCountPreview,
        generatePreviewData,
        downloadFiles,
        previewData, downloadData, downloadAllData } = useDownloadState();

    return (
        <>
            <DownloadedDataConfig
                selectedParticipantIds={selectedParticipantIds}
                setSelectedParticipantIds={setSelectedParticipantIds}
                selectedFieldIds={selectedFieldIds}
                setSelectedFieldIds={setSelectedFieldIds}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                generateCountPreview={generateCountPreview}
            />
            <DownloadTable
                status={status}
                selectedPreviewRow={selectedPreviewRow}
                downloadFiles={downloadFiles}
                previewStatus={previewStatus}
                previewData={previewData}
                generatePreviewData={generatePreviewData}
                downloadData={downloadData}
                downloadAllData={downloadAllData}
                isDownloadingAll={isDownloadingAll}
            />
        </>
    );
};

export default Page;
