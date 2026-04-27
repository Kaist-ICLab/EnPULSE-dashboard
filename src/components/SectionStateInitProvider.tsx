'use client';

import { useEffect } from "react";
import useSectionState, { comparisonTypes } from "@/hooks/useSectionState";
import dayjs from "dayjs";
import { getLocalDay } from "@/utils/date";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";

const SectionStateInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { campaign, campaignParticipants, campaignTableFields } = useCampaignStore((state) => state);
    const { updateComparisonParams, initTimeRange, updateDate } = useSectionState();

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

    useEffect(() => {
        if (!campaign) return;

        if (dayjs(campaign.start_time).toDate() >= new Date()) {
            updateDate(dayjs(campaign.start_time).toDate())
        } else if (dayjs(campaign.end_time).toDate() <= new Date()) {
            updateDate(dayjs(campaign.end_time).toDate())
        } else {
            updateDate(getLocalDay())
        }
    }, [campaign, updateDate])

    return <>{children}</>;
}

export default SectionStateInitProvider;