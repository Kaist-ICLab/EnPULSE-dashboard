'use client'

import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { useMemo } from "react";
import useCampaign from "@/hooks/useCampaign";

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
    const { campaignParticipants } = useCampaign();
    const participants = useMemo(
        () => Array.from(campaignParticipants.values()),
        [campaignParticipants]
    );

    const label = useMemo(() => {
        if (selectedParticipantIds.length === 0) return "Select Participant";
        const first = participants.find(p => p.uuid === selectedParticipantIds[0]);
        if (selectedParticipantIds.length === 1) return `P${first?.pid}`
        return `P${first?.pid} + ${selectedParticipantIds.length - 1} more`;
    }, [participants, selectedParticipantIds]);

    const toggleSelection = (uuid: string) => {
        if (isMultipleSelection) {
            if (selectedParticipantIds.includes(uuid)) {
                setSelectedParticipantIds(selectedParticipantIds.filter(id => id !== uuid));
            } else {
                setSelectedParticipantIds([...selectedParticipantIds, uuid]);
            }
        } else {
            if (selectedParticipantIds.includes(uuid)) {
                setSelectedParticipantIds([]);
            } else {
                setSelectedParticipantIds([uuid]);
            }
        }
    };

    return (
        <Dropdown
            label={label}
            placement="bottom-start"
            dismissOnClick={false}
            className={className}
        >
            <div className="min-w-48 h-64 overflow-y-auto scrollbar-thin px-2 py-2">
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
                        <DropdownItem className="font-bold" onClick={() => setSelectedParticipantIds([])}>
                            <span className="text-red-500">{isMultipleSelection ? "Deselect all" : "Deselect"}</span>
                        </DropdownItem>
                    </div>
                )}
            </div>

        </Dropdown>
    );
};

export default ParticipantDropdown;

