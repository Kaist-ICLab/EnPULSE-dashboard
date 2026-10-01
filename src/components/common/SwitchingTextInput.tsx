import { useMemo, useState } from "react";
import { TextInput } from "flowbite-react";

const SwitchingTextInput: React.FC<{
  value: string | null | undefined;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  sizing?: "sm" | "md" | "lg";
}> = ({ value, onChange, id, className = "", sizing = "md" }) => {
  const [text, setText] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const textClassName = useMemo(() => {
    switch (sizing) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-md";
      case "lg":
        return "text-lg";
    }
  }, [sizing]);

  // Lists using this component are keyed by index, so after a reorder, delete or undo
  // the same instance can show a different item. Load the current value on every
  // edit start, otherwise stale text is shown and committed onto the wrong item.
  const startEditing = () => {
    setText(value ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    setIsEditing(false);
    if (text !== (value ?? "")) onChange(text);
  };

  return (
    <div className={`flex w-full gap-2 ${className}`}>
      {isEditing ? (
        <div className="flex w-full gap-2">
          <TextInput
            id={id}
            sizing={sizing}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setIsEditing(false);
                setText(value ?? "");
              }
            }}
            className="grow"
            autoFocus
          />
        </div>
      ) : (
        <div
          className={`min-h-[1.5rem] w-full cursor-text rounded-lg border border-transparent px-2 py-1.5 hover:border-gray-300 ${textClassName}`}
          onClick={startEditing}
        >
          {value || <span className="text-gray-400">Click to edit</span>}
        </div>
      )}
    </div>
  );
};

export default SwitchingTextInput;
