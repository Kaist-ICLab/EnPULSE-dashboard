import { toast } from "sonner";

const SUCCESS_INFO_DURATION_MS = 5000;
export const notify = {
    success: (message: string) => toast.success(message, { duration: SUCCESS_INFO_DURATION_MS, }),
    info: (message: string) => toast(message, { duration: SUCCESS_INFO_DURATION_MS }),
    error: (title: string, description: string = "") => toast.error(title, { description, duration: Infinity }),
};
