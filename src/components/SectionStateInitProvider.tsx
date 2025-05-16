'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";
import useSectionState, { sectionTypes } from "@/hooks/charts/useSectionState";

const SectionStateInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { campaignParticipants, campaignTableFields } = useCampaign();
    const { setSectionParams, initTimeRange, initPinQuery } = useSectionState();

    useEffect(() => {
        setSectionParams(
            Array.from(campaignParticipants.values()).map(v => v.uuid)[0],
            Array.from(campaignTableFields.values()).filter(v => v.field_role === 'data').map(v => v.id)[0],
            new Date()
        )
    }, [campaignParticipants, campaignTableFields, setSectionParams])

    useEffect(() => {
        sectionTypes.forEach(type => {
            initTimeRange(type)
            initPinQuery(type)
        })
    }, [initTimeRange, initPinQuery])

    return <>{children}</>;
}

export default SectionStateInitProvider;