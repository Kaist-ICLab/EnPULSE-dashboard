import { ResponseStatus } from "@/types/response";
import { DownloadFileRow } from "@/types/download";
import { create } from "zustand";

interface DownloadState {
    downloadListStatus: ResponseStatus
    downloadList: DownloadFileRow[],
    selectedFieldIds: number[],
    selectedParticipantIds: string[],

    reset: () => void;
    setSelectedFieldIds: (fieldId: number[]) => void;
    setSelectedParticipantIds: (participantId: string[]) => void;

    setDownloadListStatus: (status: ResponseStatus) => void;
    setDownloadList: (downloadList: DownloadFileRow[]) => void;
    setDownloadListItemStatus: (index: number, status: ResponseStatus) => void;
    toggleDownloadListItemChecked: (index: number) => void;
    setAllDownloadListItemsChecked: (isChecked: boolean) => void;
    setAllDownloadListItemsStatus: (status: ResponseStatus) => void;
}

export default create<DownloadState>((set) => ({
    downloadListStatus: null,
    downloadList: [],
    selectedFieldIds: [],
    selectedParticipantIds: [],

    reset: () => set({ downloadListStatus: null, downloadList: [], selectedFieldIds: [], selectedParticipantIds: [] }),
    setDownloadListStatus: (status: ResponseStatus) => set({ downloadListStatus: status }),
    setDownloadList: (downloadList: DownloadFileRow[]) => set({ downloadList }),
    setDownloadListItemStatus: (index: number, status: ResponseStatus) => set((state) => {
        const newDownloadList = [...state.downloadList];
        newDownloadList[index].downloadStatus = status;
        return { downloadList: newDownloadList };
    }),
    toggleDownloadListItemChecked: (index: number) => set((state) => {
        const newDownloadList = [...state.downloadList];
        newDownloadList[index].isChecked = !newDownloadList[index].isChecked;
        return { downloadList: newDownloadList };
    }),
    setAllDownloadListItemsChecked: (isChecked: boolean) => set((state) => {
        const newDownloadList = state.downloadList.map((row) => ({ ...row, isChecked }));
        return { downloadList: newDownloadList };
    }),

    setSelectedFieldIds: (fieldId: number[]) => set({ selectedFieldIds: fieldId }),
    setSelectedParticipantIds: (participantId: string[]) => set({ selectedParticipantIds: participantId }),

    setAllDownloadListItemsStatus: (status: ResponseStatus) => set((state) => {
        const newDownloadList = state.downloadList.map((row) => ({ ...row, downloadStatus: status }));
        return { downloadList: newDownloadList };
    }),
}));