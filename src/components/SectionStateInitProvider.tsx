'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";
import useSectionState, { comparisonTypes } from "@/hooks/useSectionState";

const SectionStateInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { campaignParticipants, campaignTableFields } = useCampaign();
    const { updateComparisonParams, initTimeRange } = useSectionState();

    useEffect(() => {
        comparisonTypes.forEach(type => {
            updateComparisonParams(type, {
                uuid: Array.from(campaignParticipants.values()).map(v => v.uuid).splice(0, 1),
                fieldId: [],
            })
        })
    }, [campaignParticipants, campaignTableFields, updateComparisonParams])

    useEffect(() => {
        initTimeRange()
    }, [initTimeRange])

    return <>{children}</>;
}

export default SectionStateInitProvider;