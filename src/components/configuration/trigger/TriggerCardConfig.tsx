"use client";

import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { defaultDetection, TRIGGER_ACTION_KIND_LABEL, TriggerActionKind } from "@/types/trigger";
import { Card } from "flowbite-react";
import ConditionTreeEditor from "./ConditionTreeEditor";
import TriggerActionList from "./TriggerActionList";
import { Dropdown, DropdownItem } from "flowbite-react";
import { DeviceType } from "@/types/survey";

const TriggerCardConfig: React.FC<{ index: number }> = ({ index }) => {
  const { campaign_trigger, surveys, removeTrigger, updateTriggerName, setTriggerCondition, addTriggerAction } =
    useCampaignConfigEdit((state) => state);
  const trigger = campaign_trigger[index];
  if (!trigger) return null;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => removeTrigger(index)}
          hoverColor="red"
          size="lg"
          className="icon-[humbleicons--times]"
        />
        <SwitchingTextInput
          value={trigger.name ?? ""}
          onChange={(value) => updateTriggerName(index, value)}
          className="font-bold"
        />
      </div>

      <section className="mb-4 flex flex-col gap-1">
        <span className="mb-2 font-bold">Condition</span>
        <ConditionTreeEditor
          condition={trigger.condition}
          onChange={(next) => setTriggerCondition(index, next)}
          onRemove={() => setTriggerCondition(index, defaultDetection())}
        />
      </section>

      <section className="flex flex-col gap-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="font-bold">Actions</span>
          <Dropdown label="Add Action" size="sm" color="green" dismissOnClick>
            {(Object.keys(TRIGGER_ACTION_KIND_LABEL) as TriggerActionKind[]).map((kind) => {
              const invalid =
                (kind === "ema" && !surveys.some((survey) => survey.device_type === DeviceType.Phone)) ||
                (kind === "watch_ema" && !surveys.some((survey) => survey.device_type === DeviceType.Watch));

              return invalid ? null : (
                <DropdownItem key={kind} onClick={() => addTriggerAction(index, kind)}>
                  {TRIGGER_ACTION_KIND_LABEL[kind]}
                </DropdownItem>
              );
            })}
          </Dropdown>
        </div>
        <TriggerActionList triggerIndex={index} />
      </section>
    </Card>
  );
};

export default TriggerCardConfig;
