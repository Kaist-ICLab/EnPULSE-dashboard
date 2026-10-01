"use client";

import { useMemo } from "react";
import { Select } from "flowbite-react";
import {
  TRIGGER_SENSOR_KIND_LABEL,
  TriggerCondition,
  TriggerSensorKind,
  defaultDetection,
  getTriggerSensorValues,
} from "@/types/trigger";
import { getTimingScheduleValues } from "@/types/timingSchedule";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { Block, BlockHeaderButton, BlockSlot } from "./blocks/Block";

const ConditionTreeEditor: React.FC<{
  condition: TriggerCondition;
  parentCondition?: TriggerCondition;
  onChange: (next: TriggerCondition) => void;
  onRemove: () => void;
}> = ({ condition, parentCondition, onChange, onRemove }) => {
  const wrapInNot = () => onChange({ type: "not", child: condition });
  const wrapInGroup = (op: "and" | "or") => onChange({ type: op, children: [condition] });

  // Following the precedent TriggerCardConfig.tsx already sets (pulling `surveys` straight
  // from the store), pull `tables` here rather than prop-drilling it down — "timing"'s value
  // list is dynamic (the campaign's own named schedules), unlike the other sensors' static enums.
  const tables = useCampaignConfigEdit((state) => state.tables);
  const timingScheduleValues = useMemo(() => getTimingScheduleValues(tables), [tables]);

  if (condition.type === "detection") {
    const values = getTriggerSensorValues(condition.sensor, timingScheduleValues);
    return (
      <Block
        palette="blue"
        label={condition.sensor}
        wrapControl={
          <>
            {parentCondition?.type !== "and" && (
              <BlockHeaderButton onClick={() => wrapInGroup("and")}>AND</BlockHeaderButton>
            )}
            {parentCondition?.type !== "or" && (
              <BlockHeaderButton onClick={() => wrapInGroup("or")}>OR</BlockHeaderButton>
            )}
            {parentCondition?.type !== "not" && <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>}
          </>
        }
        headerControls={
          <BlockHeaderButton danger onClick={onRemove}>
            <span className="icon-[humbleicons--times] h-3 w-3" />
          </BlockHeaderButton>
        }
        switchOptions={(Object.keys(TRIGGER_SENSOR_KIND_LABEL) as TriggerSensorKind[]).map((s) => ({
          label: TRIGGER_SENSOR_KIND_LABEL[s],
          value: s,
        }))}
        onLabelChange={(value) => {
          const nextValues = getTriggerSensorValues(value as TriggerSensorKind, timingScheduleValues);
          onChange({ ...condition, sensor: value as TriggerSensorKind, value: nextValues[0] ?? "" });
        }}
      >
        <div className="flex flex-row flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">{TRIGGER_SENSOR_KIND_LABEL[condition.sensor]} equals</span>
          {values.length === 0 ? (
            <span className="text-sm text-amber-600 italic">
              No timing schedules defined yet — add one under Passive Sensing.
            </span>
          ) : (
            <Select
              sizing="sm"
              value={condition.value}
              onChange={(e) => onChange({ ...condition, value: e.target.value })}
            >
              {values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          )}
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
            {parentCondition?.type !== "and" && (
              <BlockHeaderButton onClick={() => wrapInGroup("and")}>AND</BlockHeaderButton>
            )}
            {parentCondition?.type !== "or" && (
              <BlockHeaderButton onClick={() => wrapInGroup("or")}>OR</BlockHeaderButton>
            )}
          </>
        }
        headerControls={
          <>
            <BlockHeaderButton onClick={() => onChange(condition.child)}>Unwrap</BlockHeaderButton>
            <BlockHeaderButton danger onClick={onRemove}>
              <span className="icon-[humbleicons--times] h-3 w-3" />
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
          {parentCondition?.type !== otherOp && (
            <BlockHeaderButton onClick={() => wrapInGroup(otherOp)}>{otherOp.toUpperCase()}</BlockHeaderButton>
          )}
          {parentCondition?.type !== "not" && <BlockHeaderButton onClick={wrapInNot}>NOT</BlockHeaderButton>}
        </>
      }
      headerControls={
        <>
          {/* Only offer Unwrap with exactly one child: unwrapping an empty group
              would replace the condition with `undefined` and crash the editor. */}
          {condition.children.length === 1 && (
            <BlockHeaderButton onClick={() => onChange(condition.children[0])}>Unwrap</BlockHeaderButton>
          )}
          <BlockHeaderButton danger onClick={onRemove}>
            <span className="icon-[humbleicons--times] h-3 w-3" />
          </BlockHeaderButton>
        </>
      }
      switchOptions={[
        { label: "AND", value: "and" },
        { label: "OR", value: "or" },
      ]}
      onLabelChange={(value) => onChange({ ...condition, type: value as "and" | "or", children: condition.children })}
    >
      <BlockSlot palette="amber">
        {condition.children.length === 0 ? (
          <p className="text-sm text-gray-500 italic">empty</p>
        ) : (
          condition.children.map((child, i) => (
            <ConditionTreeEditor
              key={i}
              condition={child}
              parentCondition={condition}
              onChange={(next) =>
                onChange({ ...condition, children: condition.children.map((c, j) => (j === i ? next : c)) })
              }
              onRemove={() => onChange({ ...condition, children: condition.children.filter((_, j) => j !== i) })}
            />
          ))
        )}
        <ChildAddBar
          parentCondition={condition}
          onAddDetection={() => onChange({ ...condition, children: [...condition.children, defaultDetection()] })}
          onAddAnd={() =>
            onChange({
              ...condition,
              children: [...condition.children, { type: "and", children: [defaultDetection()] }],
            })
          }
          onAddOr={() =>
            onChange({
              ...condition,
              children: [...condition.children, { type: "or", children: [defaultDetection()] }],
            })
          }
          onAddNot={() =>
            onChange({ ...condition, children: [...condition.children, { type: "not", child: defaultDetection() }] })
          }
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
  <div className="flex flex-row flex-wrap items-center gap-1 pt-1">
    <button
      type="button"
      onClick={onAddDetection}
      className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 hover:bg-blue-200"
    >
      + Detection
    </button>
    {parentCondition.type !== "and" && (
      <button
        type="button"
        onClick={onAddAnd}
        className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200"
      >
        + AND group
      </button>
    )}
    {parentCondition.type !== "or" && (
      <button
        type="button"
        onClick={onAddOr}
        className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200"
      >
        + OR group
      </button>
    )}
    {parentCondition.type !== "not" && (
      <button
        type="button"
        onClick={onAddNot}
        className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200"
      >
        + NOT group
      </button>
    )}
  </div>
);

export default ConditionTreeEditor;
