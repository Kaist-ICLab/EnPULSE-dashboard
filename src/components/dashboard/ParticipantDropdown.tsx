"use client";

import useParticipantDropdownState from "@/hooks/dashboard/useParticipantDropdownState";
import { Dropdown, DropdownDivider, DropdownItem, Select } from "flowbite-react";
import IconButton from "../common/IconButton";

const ParticipantDropdown: React.FC<{
  selectedParticipantIds: string[];
  setSelectedParticipantIds: (ids: string[]) => void;
  className?: string;
  isMultipleSelection?: boolean;
  showSelectAllParticipants?: boolean;
}> = ({
  selectedParticipantIds,
  setSelectedParticipantIds,
  className,
  isMultipleSelection = false,
  showSelectAllParticipants = false,
}) => {
  const {
    label,
    participants,
    toggleSelection,
    batchIndex,
    batchSize,
    maxBatchIndex,
    setBatchIndex,
    setBatchSize,
    toggleAllParticipantsSelection,
    isAllParticipantsSelected,
  } = useParticipantDropdownState(selectedParticipantIds, setSelectedParticipantIds, isMultipleSelection);

  return (
    <Dropdown label={label} placement="bottom-start" dismissOnClick={false} className={className}>
      <div className="h-80 min-w-48 scrollbar-thin overflow-y-auto px-2 py-2">
        {participants.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-sm bg-gray-50 text-sm text-gray-500">
            <span className="icon-[material-symbols--person-off] mb-2 text-4xl"></span>
            No participants joined... yet
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="grow scrollbar-thin overflow-y-auto">
              {participants.map((p) => (
                <DropdownItem
                  key={p.uuid}
                  className={selectedParticipantIds.includes(p.uuid) ? "bg-gray-100 text-blue-600" : "text-gray-700"}
                  onClick={() => toggleSelection(p.uuid)}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedParticipantIds.includes(p.uuid)}
                    onChange={() => {}}
                  />
                  P{p.pid}
                </DropdownItem>
              ))}
            </div>
            <DropdownDivider />
            <div className="w-full">
              <div className="grid grid-cols-[auto_auto] items-center justify-between gap-x-3 gap-y-1 px-2 py-1">
                <div className="text-xs text-gray-500">Batch #</div>
                <div className="text-xs text-gray-500">Batch size</div>
                <div className="flex items-center gap-1">
                  <IconButton
                    size="lg"
                    className="icon-[material-symbols--chevron-left-rounded]"
                    onClick={() => setBatchIndex(batchIndex - 1)}
                    disabled={batchIndex == 1}
                  />
                  <span className="text-sm">
                    {batchIndex} / {maxBatchIndex}
                  </span>
                  <IconButton
                    size="lg"
                    className="icon-[material-symbols--chevron-right-rounded]"
                    onClick={() => setBatchIndex(batchIndex + 1)}
                    disabled={batchIndex == maxBatchIndex}
                  />
                </div>
                <div>
                  <Select
                    sizing="sm"
                    className="w-16"
                    value={batchSize.toString()}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    disabled={!isMultipleSelection}
                  >
                    <option>1</option>
                    {isMultipleSelection && (
                      <>
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                      </>
                    )}
                  </Select>
                </div>
              </div>
            </div>
            <DropdownDivider />
            <ParticipantSelectionToggleButton
              isMultipleSelection={isMultipleSelection}
              showSelectAllParticipants={showSelectAllParticipants}
              isAllParticipantsSelected={isAllParticipantsSelected}
              deselectAllSelectedParticipants={() => setSelectedParticipantIds([])}
              toggleAllParticipantsSelection={toggleAllParticipantsSelection}
            />
          </div>
        )}
      </div>
    </Dropdown>
  );
};

const ParticipantSelectionToggleButton: React.FC<{
  isMultipleSelection: boolean;
  showSelectAllParticipants: boolean;
  isAllParticipantsSelected: boolean;
  deselectAllSelectedParticipants: () => void;
  toggleAllParticipantsSelection: () => void;
}> = ({
  isMultipleSelection,
  showSelectAllParticipants,
  isAllParticipantsSelected,
  deselectAllSelectedParticipants,
  toggleAllParticipantsSelection,
}) => {
  if (showSelectAllParticipants) {
    return (
      <DropdownItem
        className={`font-bold ${isAllParticipantsSelected ? "text-red-500" : ""}`}
        onClick={toggleAllParticipantsSelection}
      >
        {isAllParticipantsSelected ? "Deselect all" : "Select all"}
      </DropdownItem>
    );
  } else {
    return (
      <DropdownItem className="font-bold" onClick={deselectAllSelectedParticipants}>
        <span className="text-red-500">{isMultipleSelection ? "Deselect all" : "Deselect"}</span>
      </DropdownItem>
    );
  }
};

export default ParticipantDropdown;
