'use client'

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { DeviceType } from "@/types/survey";
import {
    TRIGGER_ACTION_KIND_LABEL,
    TriggerAction,
} from "@/types/trigger";
import { Select, TextInput } from "flowbite-react";
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
            wrapControl={<BlockHeaderButton danger onClick={onRemove}><span className="icon-[humbleicons--times] w-3 h-3"></span></BlockHeaderButton>}
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
    const { surveys } = useCampaignConfigEdit((state) => state);
    const expectedDeviceType = action.kind === "watch_ema" ? DeviceType.Watch : DeviceType.Phone;
    const eligibleSurveys = surveys
        .map((s, idx) => ({ s, idx }))
        .filter(({ s }) => s.device_type === expectedDeviceType);

    return (
        <div className="flex flex-col gap-3">
            <Select
                sizing="md"
                value={action.surveyIndex}
                onChange={(e) => onChange({ kind: action.kind, surveyIndex: Number(e.target.value), minIntervalMillis: action.minIntervalMillis })}
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
            <div className="flex flex-row items-center">
                <span className="block text-sm text-gray-900 mr-4">Minimum Interval Between Surveys:</span>
                <TextInput
                    type="number"
                    sizing="sm"
                    value={action.minIntervalMillis}
                    onChange={(e) => onChange({ kind: action.kind, surveyIndex: action.surveyIndex, minIntervalMillis: Number(e.target.value) })}

                />
                <span className="text-sm ml-1 text-gray-900">ms</span>
            </div>
        </div>
    );
};

export default ActionBlock;
