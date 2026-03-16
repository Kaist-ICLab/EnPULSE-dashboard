'use client'

import useParticipantDropdownState from "@/hooks/dashboard/useParticipantDropdownState";
import { Dropdown, DropdownDivider, DropdownItem, Select } from "flowbite-react";
import IconButton from "../common/IconButton";

interface ParticipantDropdownProps {
    selectedParticipantIds: string[];
    setSelectedParticipantIds: (ids: string[]) => void;
    className?: string;
    isMultipleSelection?: boolean;
}

const ParticipantDropdown: React.FC<ParticipantDropdownProps> = ({
    selectedParticipantIds,
    setSelectedParticipantIds,
    className,
    isMultipleSelection = false,
}) => {
    const { label, participants, toggleSelection, batchIndex, batchSize, maxBatchIndex, setBatchIndex, setBatchSize } = useParticipantDropdownState(selectedParticipantIds, setSelectedParticipantIds, isMultipleSelection);


    return (
        <Dropdown
            label={label}
            placement="bottom-start"
            dismissOnClick={false}
            className={className}
        >
            <div className="min-w-48 h-80 overflow-y-auto scrollbar-thin px-2 py-2">
                {participants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm bg-gray-50 rounded-sm">
                        <span className="icon-[material-symbols--person-off] text-4xl mb-2"></span>
                        No participants joined... yet
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="overflow-y-auto grow scrollbar-thin">
                            {participants.map((p) => (
                                <DropdownItem
                                    key={p.uuid}
                                    className={selectedParticipantIds.includes(p.uuid) ? "text-blue-600 bg-gray-100" : "text-gray-700"}
                                    onClick={() => toggleSelection(p.uuid)}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedParticipantIds.includes(p.uuid)}
                                        onChange={() => { }}
                                    />
                                    P{p.pid}
                                </DropdownItem>
                            ))}
                        </div>
                        <DropdownDivider />
                        <div className="w-full">
                            <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 items-center justify-between py-1 px-2 ">
                                <div className="text-xs text-gray-500">Batch #</div>
                                <div className="text-xs text-gray-500">Batch size</div>
                                <div className="flex items-center gap-1">
                                    <IconButton
                                        size="lg"
                                        className="icon-[material-symbols--chevron-left-rounded]"
                                        onClick={() => setBatchIndex(batchIndex - 1)}
                                        disabled={batchIndex == 1}
                                    />
                                    <span className="text-sm">{batchIndex} / {maxBatchIndex}</span>
                                    <IconButton
                                        size="lg"
                                        className="icon-[material-symbols--chevron-right-rounded]"
                                        onClick={() => setBatchIndex(batchIndex + 1)}
                                        disabled={batchIndex == maxBatchIndex}
                                    />
                                </div>
                                <div>
                                    <Select sizing="sm" className="w-16" value={batchSize.toString()} onChange={(e) => setBatchSize(parseInt(e.target.value))} disabled={!isMultipleSelection}>
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
                        <DropdownItem className="font-bold text-red-500" onClick={() => setSelectedParticipantIds([])}>
                            {isMultipleSelection ? "Deselect all" : "Deselect"}
                        </DropdownItem>
                    </div>
                )}
            </div>

        </Dropdown>
    );
};

export default ParticipantDropdown;

