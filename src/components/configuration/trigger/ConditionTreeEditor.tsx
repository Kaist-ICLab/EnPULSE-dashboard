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
    parentCondition?: TriggerCondition;
    onChange: (next: TriggerCondition) => void;
    onRemove: () => void;
}> = ({ condition, parentCondition, onChange, onRemove }) => {
    const wrapInNot = () => onChange({ type: "not", child: condition });
    const wrapInGroup = (op: "and" | "or") => onChange({ type: op, children: [condition] });

    if (condition.type === "detection") {
        return (
            <Block
                palette="blue"
                label={condition.sensor}
                wrapControl={
                    <>
                        {parentCondition?.type !== "and" && <BlockHeaderButton onClick={() => wrapInGroup("and")}>AND</BlockHeaderButton>}
                        {parentCondition?.type !== "or" && <BlockHeaderButton onClick={() => wrapInGroup("or")}>OR</BlockHeaderButton>}
                        {parentCondition?.type !== "not" && <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>}
                    </>
                }
                headerControls={
                    <BlockHeaderButton danger onClick={onRemove}>
                        <span className="icon-[humbleicons--times] w-3 h-3" />
                    </BlockHeaderButton>
                }
                switchOptions={
                    (Object.keys(TRIGGER_SENSOR_KIND_LABEL) as TriggerSensorKind[]).map((s) => ({ label: TRIGGER_SENSOR_KIND_LABEL[s], value: s }))
                }
                onLabelChange={(value) => onChange({ ...condition, sensor: value as TriggerSensorKind, value: TRIGGER_SENSOR_VALUES[value as TriggerSensorKind][0] })}
            >
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    <span className="text-gray-700 text-sm">{TRIGGER_SENSOR_KIND_LABEL[condition.sensor]} equals</span>
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
                wrapControl={
                    <>
                        {parentCondition?.type !== "and" && <BlockHeaderButton onClick={() => wrapInGroup("and")}>AND</BlockHeaderButton>}
                        {parentCondition?.type !== "or" && <BlockHeaderButton onClick={() => wrapInGroup("or")}>OR</BlockHeaderButton>}
                    </>
                }
                headerControls={
                    <>
                        <BlockHeaderButton onClick={() => onChange(condition.child)}>Unwrap</BlockHeaderButton>
                        <BlockHeaderButton danger onClick={onRemove}>
                            <span className="icon-[humbleicons--times] w-3 h-3" />
                        </BlockHeaderButton>
                    </>
                }
            >
                <BlockSlot palette="amber">
                    <ConditionTreeEditor
                        condition={condition.child}
                        parentCondition={condition}
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
            label={op}
            wrapControl={
                <>
                    {parentCondition?.type !== otherOp && <BlockHeaderButton onClick={() => wrapInGroup(otherOp)}>{otherOp.toUpperCase()}</BlockHeaderButton>}
                    {parentCondition?.type !== "not" && <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>}
                </>
            }
            headerControls={
                <>
                    {condition.children.length <= 1 && <BlockHeaderButton onClick={() => onChange(condition.children[0])}>Unwrap</BlockHeaderButton>}
                    <BlockHeaderButton danger onClick={onRemove}>
                        <span className="icon-[humbleicons--times] w-3 h-3" />
                    </BlockHeaderButton>
                </>
            }
            switchOptions={
                [
                    { label: "AND", value: "and" },
                    { label: "OR", value: "or" },
                ]
            }
            onLabelChange={(value) => onChange({ ...condition, type: value as "and" | "or", children: condition.children })}
        >
            <BlockSlot palette="amber">
                {condition.children.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">empty</p>
                ) : (
                    condition.children.map((child, i) => (
                        <ConditionTreeEditor
                            key={i}
                            condition={child}
                            parentCondition={condition}
                            onChange={(next) => onChange({ ...condition, children: condition.children.map((c, j) => (j === i ? next : c)) })}
                            onRemove={() => onChange({ ...condition, children: condition.children.filter((_, j) => j !== i) })}
                        />
                    ))
                )}
                <ChildAddBar
                    parentCondition={condition}
                    onAddDetection={() => onChange({ ...condition, children: [...condition.children, defaultDetection()] })}
                    onAddAnd={() => onChange({ ...condition, children: [...condition.children, { type: "and", children: [defaultDetection()] }] })}
                    onAddOr={() => onChange({ ...condition, children: [...condition.children, { type: "or", children: [defaultDetection()] }] })}
                    onAddNot={() => onChange({ ...condition, children: [...condition.children, { type: "not", child: defaultDetection() }] })}
                />
            </BlockSlot>
        </Block>
    );
};

const ChildAddBar: React.FC<{
    parentCondition: TriggerCondition;
    onAddDetection: () => void;
    onAddAnd: () => void;
    onAddOr: () => void;
    onAddNot: () => void;
}> = ({ parentCondition, onAddDetection, onAddAnd, onAddOr, onAddNot }) => (
    <div className="flex flex-row items-center gap-1 flex-wrap pt-1">
        <button type="button" onClick={onAddDetection} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800">
            + Detection
        </button>
        {parentCondition.type !== "and" && (
            <button type="button" onClick={onAddAnd} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800">
                + AND group
            </button>
        )}
        {parentCondition.type !== "or" && (
            <button type="button" onClick={onAddOr} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800">
                + OR group
            </button>
        )}
        {parentCondition.type !== "not" && (
            <button type="button" onClick={onAddNot} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800">
                + NOT group
            </button>
        )}
    </div>
);

export default ConditionTreeEditor;
