'use client'

import { Button } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import TriggerCardConfig from "./TriggerCardConfig";

const TriggerForm: React.FC = () => {
    const { campaign_trigger, addTrigger } = useCampaignConfigEdit((state) => state);

    return (
        <div className="w-full flex flex-col gap-4">
            {campaign_trigger.length === 0 ? (
                <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                    <p className="text-gray-500 text-lg">No triggers configured</p>
                </div>
            ) : (
                campaign_trigger.map((_, index) => (
                    <TriggerCardConfig key={index} index={index} />
                ))
            )}
            <Button color="blue" onClick={() => addTrigger()}>
                <span className="icon-[material-symbols--add] mr-2 w-5 h-5" />
                Add Trigger
            </Button>
        </div>
    );
};

export default TriggerForm;
