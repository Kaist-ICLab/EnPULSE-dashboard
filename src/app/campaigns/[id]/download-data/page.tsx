"use client";

import { DownloadTable } from "@/components/download/DownloadTable";
import DownloadDataConfig from "@/components/download/DownloadDataConfig";

const Page = () => {
    return (
        <>
            <DownloadDataConfig />
            <DownloadTable />
        </>
    );
};

export default Page;
