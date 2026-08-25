"use client";

import { Button } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import TriggerCardConfig from "./TriggerCardConfig";

const TriggerForm: React.FC = () => {
  const { campaign_trigger, addTrigger } = useCampaignConfigEdit((state) => state);

  return (
    <div className="flex w-full flex-col gap-4">
      {campaign_trigger.length === 0 ? (
        <div className="flex w-full items-center justify-center bg-gray-100 py-12">
          <p className="text-lg text-gray-500">No triggers configured</p>
        </div>
      ) : (
        campaign_trigger.map((_, index) => <TriggerCardConfig key={index} index={index} />)
      )}
      <Button color="blue" onClick={() => addTrigger()} className="mt-1 w-full">
        <span className="icon-[material-symbols--add] mr-2 h-5 w-5" />
        Add Trigger
      </Button>
    </div>
  );
};

export default TriggerForm;
