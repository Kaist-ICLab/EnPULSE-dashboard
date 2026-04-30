import { toast } from "sonner";

const SUCCESS_INFO_DURATION_MS = 8000;
export const notify = {
    success: (message: string) => toast.success(message, { duration: SUCCESS_INFO_DURATION_MS }),
    info: (message: string) => toast(message, { duration: SUCCESS_INFO_DURATION_MS }),
    error: (message: string) => toast.error(message, { duration: Infinity }),
};
