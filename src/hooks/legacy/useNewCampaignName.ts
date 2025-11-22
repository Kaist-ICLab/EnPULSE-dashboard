import { useState } from "react";

export default function useNewCampaignName(initialName: string) {
    const [name, setName] = useState(initialName)
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

    const onCheck = () => {
        const isValidName = Math.random() > 0.5;

        if (isValidName) {
            setStatus({ success: true, message: "Valid name" });
        } else {
            setStatus({ success: false, message: "Invalid name. Choose a different name." });
        }

        // Clear the status message after 3 seconds
        setTimeout(() => {
            setStatus(null);
        }, 3000);
    }

    return { name, setName, status, onCheck }
}

