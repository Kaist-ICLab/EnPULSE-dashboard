"use client";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useEffect } from "react";
import { Tooltip, Kbd } from "flowbite-react";

const UndoRedoButtons: React.FC = () => {
  const configEditStore = useCampaignConfigEditStoreApi();
  const { pastStates, futureStates, undo, redo } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.ctrlKey || event.metaKey;
      if (!isModifierPressed || event.key.toLowerCase() !== "z" || isEditableTarget(event.target)) return;

      event.preventDefault();
      if (event.shiftKey) {
        if (futureStates.length > 0) redo();
        return;
      }

      if (pastStates.length > 0) undo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pastStates.length, futureStates.length, redo, undo]);

  return (
    <div className="flex items-center gap-2">
      <SingleButton
        onClick={() => undo()}
        disabled={pastStates.length === 0}
        tooltipText="Undo"
        shortcut={["Ctrl", "Z"]}
      >
        <span className="icon-[material-symbols--undo] h-6 w-6" />
      </SingleButton>
      <SingleButton
        onClick={() => redo()}
        disabled={futureStates.length === 0}
        tooltipText="Redo"
        shortcut={["Ctrl", "Shift", "Z"]}
      >
        <span className="icon-[material-symbols--redo] h-6 w-6" />
      </SingleButton>
    </div>
  );
};

const SingleButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  tooltipText: string;
  shortcut: string[];
  children: React.ReactNode;
}> = ({ onClick, disabled, tooltipText, shortcut, children }) => {
  return (
    <Tooltip
      content={
        <div className="text-center">
          <div className="mb-1">{tooltipText}</div>
          <div className="flex gap-1">
            {shortcut.map((key, index) => (
              <Kbd key={index}>{key}</Kbd>
            ))}
          </div>
        </div>
      }
      hidden={disabled}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center text-gray-500 not-disabled:cursor-pointer hover:text-gray-700 disabled:text-gray-300"
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default UndoRedoButtons;
