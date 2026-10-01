"use client";

import NumberInput from "@/components/common/NumberInput";

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
    <NumberInput
      sizing="sm"
      min={0}
      step={1}
      integer
      value={value ?? 0}
      onValueChange={(parsed) => onChange(parsed > 0 ? parsed : 0)}
    />
    <span className="ml-1 text-sm text-gray-900">ms</span>
  </div>
);

export default MinIntervalInput;
