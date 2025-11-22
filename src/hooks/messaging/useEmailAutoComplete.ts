import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { useMemo } from "react";
import useCampaign from "../useCampaign";
import { CampaignParticipant } from "@/types/campaign";

export default function useEmailAutoComplete(
    value: string,
    sendTo: CampaignParticipant[],
    setSendTo: Dispatch<SetStateAction<CampaignParticipant[]>>,
    onInit: () => void,
) {
    const { campaignParticipants } = useCampaign();
    const [focusIndex, setFocusIndex] = useState(-1);

    const suggestions = useMemo(() => {
        if (!value) return []

        const suggestions = Array.from(campaignParticipants.values())
            .filter(p => !sendTo.map(v => v.email).includes(p.email))
            .filter(p => p.email.toLowerCase().includes(value.toLowerCase()));
        return suggestions
    }, [campaignParticipants, value, sendTo])

    const addSendTo = useCallback((participant: CampaignParticipant) => {
        setSendTo(prev => [...prev, participant]);
        onInit();
        setFocusIndex(-1);
    }, [setSendTo, onInit, setFocusIndex])

    return { suggestions, addSendTo, focusIndex, setFocusIndex }
}
