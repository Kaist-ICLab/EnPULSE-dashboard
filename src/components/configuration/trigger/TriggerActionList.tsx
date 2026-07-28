'use client'

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import ActionBlock from "./action/ActionBlock";

const TriggerActionList: React.FC<{ triggerIndex: number }> = ({ triggerIndex }) => {
    const { campaign_trigger, removeTriggerAction, updateTriggerAction } = useCampaignConfigEdit((state) => state);
    const trigger = campaign_trigger[triggerIndex];
    if (!trigger) return null;

    return (
        <div className="flex flex-col gap-2">
            {trigger.actions.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No actions yet — pick one below.</p>
            ) : (
                trigger.actions.map((action, i) => (
                    <ActionBlock
                        key={i}
                        action={action}
                        onChange={(next) => updateTriggerAction(triggerIndex, i, next)}
                        onRemove={() => removeTriggerAction(triggerIndex, i)}
                    />
                ))
            )}
        </div>
    );
};

export default TriggerActionList;
