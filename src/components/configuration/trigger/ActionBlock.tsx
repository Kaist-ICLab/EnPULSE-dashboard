'use client'

import { Select } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { DeviceType } from "@/types/survey";
import {
    TRIGGER_ACTION_KIND_LABEL,
    TriggerAction,
} from "@/types/trigger";
import { Block, BlockHeaderButton } from "./blocks/Block";
import BroadcastActionEditor from "./BroadcastActionEditor";

// One action rendered as a green block. The body content depends on the action kind.
const ActionBlock: React.FC<{
    action: TriggerAction;
    onChange: (next: TriggerAction) => void;
    onRemove: () => void;
}> = ({ action, onChange, onRemove }) => {
    return (
        <Block
            palette="green"
            label={TRIGGER_ACTION_KIND_LABEL[action.kind]}
            headerControls={<BlockHeaderButton danger onClick={onRemove}>×</BlockHeaderButton>}
        >
            {action.kind === "broadcast" ? (
                <BroadcastActionEditor action={action} onChange={onChange} />
            ) : (
                <SurveyActionBody action={action} onChange={onChange} />
            )}
        </Block>
    );
};

const SurveyActionBody: React.FC<{
    action: Extract<TriggerAction, { kind: "ema" | "watch_ema" }>;
    onChange: (next: TriggerAction) => void;
}> = ({ action, onChange }) => {
    const { surveys } = useCampaignConfigEdit();
    const expectedDeviceType = action.kind === "watch_ema" ? DeviceType.Watch : DeviceType.Phone;
    const eligibleSurveys = surveys
        .map((s, idx) => ({ s, idx }))
        .filter(({ s }) => s.device_type === expectedDeviceType);

    return (
        <div className="flex flex-col gap-2">
            <Select
                sizing="sm"
                value={action.surveyIndex}
                onChange={(e) => onChange({ kind: action.kind, surveyIndex: Number(e.target.value) })}
            >
                <option value={-1}>Select a survey…</option>
                {eligibleSurveys.map(({ s, idx }) => (
                    <option key={idx} value={idx}>{s.title || `Survey ${idx + 1}`}</option>
                ))}
            </Select>
            {eligibleSurveys.length === 0 && (
                <p className="text-xs text-red-600">
                    No {action.kind === "watch_ema" ? "Watch" : "Phone"} surveys configured.
                </p>
            )}
        </div>
    );
};

export default ActionBlock;
