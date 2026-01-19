'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";
import useSectionState from "@/hooks/useSectionState";

const SectionStateInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { campaignParticipants, campaignTableFields } = useCampaign();
    const { updateTimelineParams, initTimeRange } = useSectionState();

    useEffect(() => {
        updateTimelineParams({
            uuid: Array.from(campaignParticipants.values()).map(v => v.uuid)[0],
            fieldId: Array.from(campaignTableFields.values()).filter(v => v.field_role === 'data').map(v => v.id)[0],
        })
    }, [campaignParticipants, campaignTableFields, updateTimelineParams])

    useEffect(() => {
        initTimeRange()
    }, [initTimeRange])

    return <>{children}</>;
}

export default SectionStateInitProvider;