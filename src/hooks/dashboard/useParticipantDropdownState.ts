import { useCallback, useEffect, useMemo, useState } from "react";
import useCampaign from "../useCampaign";

export default function useParticipantDropdownState(
    selectedParticipantIds: string[],
    setSelectedParticipantIds: (ids: string[]) => void,
    isMultipleSelection: boolean,
) {
    const [batchIndex, _setBatchIndex] = useState(1);
    const [batchSize, _setBatchSize] = useState(1);

    const { campaignParticipants } = useCampaign();

    useEffect(() => {
        _setBatchIndex(1);
        _setBatchSize(isMultipleSelection ? 5 : 1);
    }, [isMultipleSelection]);

    const participants = useMemo(
        () => Array.from(campaignParticipants.values()),
        [campaignParticipants]
    );

    const isAllParticipantsSelected = useMemo(() => {
        return selectedParticipantIds.length === participants.length;
    }, [selectedParticipantIds, participants]);

    const toggleSelection = useCallback((uuid: string) => {
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
    }, [selectedParticipantIds, isMultipleSelection, setSelectedParticipantIds]);

    const toggleAllParticipantsSelection = useCallback(() => {
        if (isAllParticipantsSelected) {
            setSelectedParticipantIds([]);
        } else {
            setSelectedParticipantIds(participants.map(p => p.uuid));
        }
    }, [participants, isAllParticipantsSelected, setSelectedParticipantIds]);

    const label = useMemo(() => {
        if (selectedParticipantIds.length === 0) return "Select Participant";
        const first = participants.find(p => p.uuid === selectedParticipantIds[0]);
        if (selectedParticipantIds.length === 1) return `P${first?.pid}`
        return `P${first?.pid} + ${selectedParticipantIds.length - 1} more`;
    }, [participants, selectedParticipantIds]);

    const maxBatchIndex = useMemo(() => {
        return Math.ceil(participants.length / batchSize);
    }, [participants, batchSize]);

    const firstSelectedParticipantIndex = useMemo(() => {
        return participants.findIndex(p => selectedParticipantIds.includes(p.uuid));
    }, [participants, selectedParticipantIds]);

    const setBatchIndex = useCallback((batchIndex: number) => {
        const newBatchIndex = Math.min(Math.max(batchIndex, 1), maxBatchIndex);
        setSelectedParticipantIds(participants.filter((_, idx) => idx >= (newBatchIndex - 1) * batchSize && idx < newBatchIndex * batchSize).map(p => p.uuid));
        _setBatchIndex(newBatchIndex);
    }, [maxBatchIndex, _setBatchIndex, setSelectedParticipantIds, participants, batchSize]);

    const setBatchSize = useCallback((batchSize: number) => {
        const newBatchIndex = Math.floor(firstSelectedParticipantIndex / batchSize) + 1;
        setSelectedParticipantIds(participants.filter((_, idx) => idx >= (newBatchIndex - 1) * batchSize && idx < newBatchIndex * batchSize).map(p => p.uuid));
        _setBatchIndex(newBatchIndex);
        _setBatchSize(batchSize);
    }, [firstSelectedParticipantIndex, setSelectedParticipantIds, participants]);

    return {
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
    };
}