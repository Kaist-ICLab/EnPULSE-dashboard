"use client";

import { DownloadTable } from "@/components/download/DownloadTable";
import DownloadedDataConfig from "@/components/download/DownloadedDataConfig";
import useDownloadState from "@/hooks/useDownloadState";

const Page = () => {
    const { status, selectedParticipantIds, setSelectedParticipantIds, selectedFieldIds, setSelectedFieldIds, startDate, setStartDate, endDate, setEndDate, generateCountPreview, previewRows, downloadData } = useDownloadState();

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
            <DownloadTable status={status} previewRows={previewRows} downloadData={downloadData} />
        </>
    );
};

export default Page;
