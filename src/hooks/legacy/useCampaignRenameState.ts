import { useEffect, useState } from "react";
import useCampaigns from "./useCampaigns";

export default function useCampaignRenameState(initialName: string) {
    const { currentCampaign, renameCampaign } = useCampaigns()
    const [name, setName] = useState(initialName)
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

    // Synchronize campaignName with currentCampaign.name when it changes
    useEffect(() => {
        setName(currentCampaign.name);
    }, [currentCampaign.name]);

    const onCheck = () => {
        const isRenamed = renameCampaign(currentCampaign.id, name);

        if (isRenamed) {
            setStatus({ success: true, message: "Campaign renamed successfully" });
        } else {
            setStatus({ success: false, message: "No changes made or invalid name" });
        }

        // Clear the status message after 3 seconds
        setTimeout(() => {
            setStatus(null);
        }, 3000);
    }

    return { name, setName, status, onCheck }
}

