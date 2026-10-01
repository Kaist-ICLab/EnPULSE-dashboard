"use client";

import { Label, Select, TextInput } from "flowbite-react";
import {
  BROADCAST_EXTRA_TYPES,
  BroadcastExtra,
  BroadcastExtraType,
  TriggerAction,
  defaultBroadcastExtra,
  isExtraValueValid,
} from "@/types/trigger";
import IconButton from "@/components/common/IconButton";
import MinIntervalInput from "./MinIntervalInput";

const BroadcastAction: React.FC<{
  action: Extract<TriggerAction, { kind: "broadcast" }>;
  onChange: (next: TriggerAction) => void;
}> = ({ action, onChange }) => {
  const updateExtra = (i: number, patch: Partial<BroadcastExtra>) => {
    onChange({
      ...action,
      extras: action.extras.map((e, j) => (j === i ? { ...e, ...patch } : e)),
    });
  };

  const removeExtra = (i: number) => {
    onChange({ ...action, extras: action.extras.filter((_, j) => j !== i) });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium text-gray-700">Action</Label>
        <TextInput
          sizing="sm"
          placeholder="com.example.MY_ACTION"
          value={action.action}
          onChange={(e) => onChange({ ...action, action: e.target.value })}
        />
        <span className="text-xs text-gray-500">
          The Intent action string the receiving app&apos;s <code>&lt;intent-filter&gt;</code> matches on.
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium text-gray-700">
          Target package <span className="font-normal text-gray-400">(optional)</span>
        </Label>
        <TextInput
          sizing="sm"
          placeholder="com.example.app"
          value={action.targetPackage ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...action, targetPackage: v.length > 0 ? v : undefined });
          }}
        />
        <span className="text-xs text-gray-500">
          Sets <code>Intent#setPackage</code>; recommended on Android 8+ where implicit broadcasts are restricted.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-gray-700">Extras</Label>
        {action.extras.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No extras. Receivers will see an empty Bundle.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {action.extras.map((extra, i) => (
              <ExtraRow
                key={i}
                extra={extra}
                onChange={(patch) => updateExtra(i, patch)}
                onRemove={() => removeExtra(i)}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => onChange({ ...action, extras: [...action.extras, defaultBroadcastExtra()] })}
          className="flex w-fit cursor-pointer items-center justify-center rounded-md bg-green-100 px-2 py-2 text-xs font-semibold text-green-800 hover:bg-green-200"
        >
          <span className="icon-[tabler--plus] mr-2"></span> Add extra
        </button>
      </div>

      {/* Without an interval the broadcast is re-sent on every evaluation while the
          condition holds, since the trigger engine re-checks on every sensor update. */}
      <MinIntervalInput
        label="Minimum Interval Between Broadcasts:"
        value={action.minIntervalMillis}
        onChange={(minIntervalMillis) => onChange({ ...action, minIntervalMillis })}
      />
    </div>
  );
};

const ExtraRow: React.FC<{
  extra: BroadcastExtra;
  onChange: (patch: Partial<BroadcastExtra>) => void;
  onRemove: () => void;
}> = ({ extra, onChange, onRemove }) => {
  const valid = isExtraValueValid(extra);
  return (
    <div className="flex flex-row items-start gap-2">
      <TextInput
        sizing="sm"
        placeholder="key"
        value={extra.key}
        onChange={(e) => onChange({ key: e.target.value })}
        className="min-w-0 flex-1"
      />
      <Select
        sizing="sm"
        value={extra.valueType}
        onChange={(e) => {
          const valueType = e.target.value as BroadcastExtraType;
          // Reset value to a sane default for the new type so we don't carry over an invalid value.
          const value = valueType === "boolean" ? "false" : valueType === "string" ? extra.value : "";
          onChange({ valueType, value });
        }}
      >
        {BROADCAST_EXTRA_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
      {extra.valueType === "boolean" ? (
        <Select
          sizing="sm"
          value={extra.value}
          onChange={(e) => onChange({ value: e.target.value })}
          className="min-w-0 flex-1"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </Select>
      ) : (
        <TextInput
          sizing="sm"
          placeholder="value"
          value={extra.value}
          onChange={(e) => onChange({ value: e.target.value })}
          color={extra.value.length > 0 && !valid ? "failure" : undefined}
          className="min-w-0 flex-1"
        />
      )}
      <IconButton onClick={onRemove} hoverColor="red" size="lg" className="icon-[humbleicons--times] mt-1" />
    </div>
  );
};

export default BroadcastAction;
