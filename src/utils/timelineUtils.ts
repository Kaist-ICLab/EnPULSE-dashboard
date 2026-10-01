import dayjs from "dayjs";

// Locale-independent format: the hard-coded "ko-KR" locale rendered "2026. 10. 12. 14:00:00"
// for every viewer, and a browser-locale format would differ between server and client.
export const formatTime = (timestamp: number) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");

export const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const gray = "#d1d5db";
