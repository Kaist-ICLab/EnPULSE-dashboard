"use client";

import { TextInput } from "flowbite-react";

/**
 * Minimum time between two firings of a trigger action, in milliseconds.
 * The app parses the value as a whole number (Kotlin `long`) and drops the whole
 * trigger on anything else, so decimals and negatives are not accepted here.
 */
const MinIntervalInput: React.FC<{
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex flex-row items-center">
    <span className="mr-4 block text-sm text-gray-900">{label}</span>
    <TextInput
      type="number"
      sizing="sm"
      min={0}
      step={1}
      value={value ?? 0}
      onChange={(e) => {
        const parsed = Math.trunc(Number(e.target.value));
        onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
      }}
    />
    <span className="ml-1 text-sm text-gray-900">ms</span>
  </div>
);

export default MinIntervalInput;
