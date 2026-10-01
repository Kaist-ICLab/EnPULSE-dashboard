"use client";

import { TextInput, TextInputProps } from "flowbite-react";
import { useEffect, useState } from "react";

/**
 * Number field that can be cleared while typing. Writing `Number(e.target.value)` straight
 * into the store turns an empty field into 0 immediately, so to type a new value users had
 * to delete a 0 first. This keeps the raw text while focused, commits only valid numbers,
 * and restores the last committed value on blur if the field is left empty or invalid.
 */
const NumberInput: React.FC<
  Omit<TextInputProps, "type" | "value" | "onChange" | "onBlur"> & {
    value: number | null | undefined;
    onValueChange: (value: number) => void;
    /** Round to an integer before committing. */
    integer?: boolean;
  }
> = ({ value, onValueChange, integer = false, ...props }) => {
  const [text, setText] = useState(value === null || value === undefined ? "" : String(value));
  const [isFocused, setIsFocused] = useState(false);

  // Follow external changes (undo, reset after save) when the user is not typing.
  useEffect(() => {
    if (!isFocused) setText(value === null || value === undefined ? "" : String(value));
  }, [value, isFocused]);

  return (
    <TextInput
      {...props}
      type="number"
      value={text}
      onFocus={() => setIsFocused(true)}
      onChange={(e) => {
        setText(e.target.value);
        if (e.target.value.trim() === "") return;
        const parsed = Number(e.target.value);
        if (Number.isFinite(parsed)) onValueChange(integer ? Math.trunc(parsed) : parsed);
      }}
      onBlur={() => {
        setIsFocused(false);
        setText(value === null || value === undefined ? "" : String(value));
      }}
    />
  );
};

export default NumberInput;
