'use client';

import { useEffect } from "react";
import useDownloadState from "@/hooks/useDownloadState";

const DownloadInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reset } = useDownloadState();
    useEffect(() => {
        reset();
    }, [reset]);
    return <>{children}</>;
}

export default DownloadInitProvider;