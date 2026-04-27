'use client'
import { Button } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";

export default function AddSurveyButton() {
    const { addSurvey } = useCampaignConfigEdit((state) => state);

    return (
        <div className="flex items-center">
            <Button
                color="blue"
                onClick={addSurvey}
            >
                <span className="icon-[tabler--plus] mr-2"></span> Add Survey
            </Button>
        </div>

    );
}
