'use client';

import { useEffect } from "react";
import useDownloadStore from "@/stores/downloadStore";

const DownloadInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reset } = useDownloadStore();
    useEffect(() => {
        reset();
    }, [reset]);
    return <>{children}</>;
}

export default DownloadInitProvider;