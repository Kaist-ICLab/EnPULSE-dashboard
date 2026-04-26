'use client'

import { Select } from "flowbite-react";
import {
    TRIGGER_SENSOR_KIND_LABEL,
    TRIGGER_SENSOR_VALUES,
    TriggerCondition,
    TriggerSensorKind,
    defaultDetection,
} from "@/types/trigger";
import { Block, BlockHeaderButton, BlockSlot } from "./blocks/Block";

const ConditionTreeEditor: React.FC<{
    condition: TriggerCondition;
    onChange: (next: TriggerCondition) => void;
    onRemove: () => void;
}> = ({ condition, onChange, onRemove }) => {
    const wrapInNot = () => onChange({ type: "not", child: condition });
    const wrapInGroup = (op: "and" | "or") => onChange({ type: op, children: [condition] });

    if (condition.type === "detection") {
        return (
            <Block
                palette="blue"
                label={TRIGGER_SENSOR_KIND_LABEL[condition.sensor]}
                headerControls={
                    <>
                        <BlockHeaderButton onClick={() => wrapInGroup("and")}>+ AND</BlockHeaderButton>
                        <BlockHeaderButton onClick={() => wrapInGroup("or")}>+ OR</BlockHeaderButton>
                        <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>
                        <BlockHeaderButton danger onClick={onRemove}>
                            <span className="icon-[humbleicons--times] w-3 h-3" />
                        </BlockHeaderButton>
                    </>
                }
            >
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    <Select
                        sizing="sm"
                        value={condition.sensor}
                        onChange={(e) => {
                            const sensor = e.target.value as TriggerSensorKind;
                            onChange({ type: "detection", sensor, value: TRIGGER_SENSOR_VALUES[sensor][0] });
                        }}
                    >
                        {(Object.keys(TRIGGER_SENSOR_KIND_LABEL) as TriggerSensorKind[]).map((s) => (
                            <option key={s} value={s}>{TRIGGER_SENSOR_KIND_LABEL[s]}</option>
                        ))}
                    </Select>
                    <span className="text-gray-700 text-sm">equals</span>
                    <Select
                        sizing="sm"
                        value={condition.value}
                        onChange={(e) => onChange({ ...condition, value: e.target.value })}
                    >
                        {TRIGGER_SENSOR_VALUES[condition.sensor].map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </Select>
                </div>
            </Block>
        );
    }

    if (condition.type === "not") {
        return (
            <Block
                palette="amber"
                label="NOT"
                headerControls={
                    <>
                        <BlockHeaderButton onClick={() => onChange(condition.child)}>Unwrap</BlockHeaderButton>
                        <BlockHeaderButton onClick={() => wrapInGroup("and")}>+ AND</BlockHeaderButton>
                        <BlockHeaderButton onClick={() => wrapInGroup("or")}>+ OR</BlockHeaderButton>
                        <BlockHeaderButton danger onClick={onRemove}>
                            <span className="icon-[humbleicons--times] w-3 h-3" />
                        </BlockHeaderButton>
                    </>
                }
            >
                <BlockSlot palette="amber">
                    <ConditionTreeEditor
                        condition={condition.child}
                        onChange={(next) => onChange({ type: "not", child: next })}
                        onRemove={() => onChange(defaultDetection())}
                    />
                </BlockSlot>
            </Block>
        );
    }

    // and / or
    const op = condition.type;
    const otherOp = op === "and" ? "or" : "and";
    return (
        <Block
            palette="amber"
            label={op.toUpperCase()}
            headerControls={
                <>
                    <BlockHeaderButton onClick={() => onChange({ type: otherOp, children: condition.children })}>
                        → {otherOp.toUpperCase()}
                    </BlockHeaderButton>
                    <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>
                    <BlockHeaderButton danger onClick={onRemove}>
                        <span className="icon-[humbleicons--times] w-3 h-3" />
                    </BlockHeaderButton>
                </>
            }
        >
            <BlockSlot palette="amber">
                {condition.children.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">empty</p>
                ) : (
                    condition.children.map((child, i) => (
                        <ConditionTreeEditor
                            key={i}
                            condition={child}
                            onChange={(next) => onChange({ ...condition, children: condition.children.map((c, j) => (j === i ? next : c)) })}
                            onRemove={() => onChange({ ...condition, children: condition.children.filter((_, j) => j !== i) })}
                        />
                    ))
                )}
                <ChildAddBar
                    onAddDetection={() => onChange({ ...condition, children: [...condition.children, defaultDetection()] })}
                    onAddAnd={() => onChange({ ...condition, children: [...condition.children, { type: "and", children: [defaultDetection()] }] })}
                    onAddOr={() => onChange({ ...condition, children: [...condition.children, { type: "or", children: [defaultDetection()] }] })}
                />
            </BlockSlot>
        </Block>
    );
};

const ChildAddBar: React.FC<{
    onAddDetection: () => void;
    onAddAnd: () => void;
    onAddOr: () => void;
}> = ({ onAddDetection, onAddAnd, onAddOr }) => (
    <div className="flex flex-row items-center gap-1 flex-wrap pt-1">
        <button type="button" onClick={onAddDetection} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800">
            + Detection
        </button>
        <button type="button" onClick={onAddAnd} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800">
            + AND group
        </button>
        <button type="button" onClick={onAddOr} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800">
            + OR group
        </button>
    </div>
);

export default ConditionTreeEditor;
