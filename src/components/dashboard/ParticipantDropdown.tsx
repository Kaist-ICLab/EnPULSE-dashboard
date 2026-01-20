'use client'

import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { useMemo } from "react";
import useCampaign from "@/hooks/useCampaign";

interface ParticipantDropdownProps {
    selectedParticipantIds: string[];
    setSelectedParticipantIds: (ids: string[]) => void;
    isMultipleSelection?: boolean;
}

const ParticipantDropdown: React.FC<ParticipantDropdownProps> = ({
    selectedParticipantIds,
    setSelectedParticipantIds,
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
        if (selectedParticipantIds.length === 1) return first?.email ?? "Select Participant";
        return `${first?.email ?? "Participant"} + ${selectedParticipantIds.length - 1} more`;
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
        >
            <div className="min-w-56 max-h-64 overflow-y-auto scrollbar-thin">
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
                        {p.email}
                    </DropdownItem>
                ))}
            </div>
            <DropdownDivider />
            <DropdownItem className="font-bold" onClick={() => setSelectedParticipantIds([])}>
                <span className="text-red-500">{isMultipleSelection ? "Deselect all" : "Deselect"}</span>
            </DropdownItem>
        </Dropdown>
    );
};

export default ParticipantDropdown;

