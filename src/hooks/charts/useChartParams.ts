import useCampaign from "@/hooks/useCampaign";
import { ChartParams, ChartType } from "@/types/chart";
import { useCallback, useEffect, useState } from "react";

function useChartParams(
    chartType: ChartType[]
) {
    const { campaignParticipants, campaignTableFields } = useCampaign()
    const [params, _setParams] = useState<{ [key: string]: ChartParams }>(chartType.reduce((acc, type) => {
        acc[type] = {
            uuid: '',
            sid: '',
            date: new Date()
        };
        return acc;
    }, {} as { [key: string]: ChartParams }));

    const setParams = useCallback((type: ChartType, params: ChartParams) => {
        _setParams((prev) => ({ ...prev, [type]: params }));
    }, [_setParams])

    useEffect(() => {
        chartType.forEach(type => {
            setParams(type, {
                uuid: Array.from(campaignParticipants.values()).map(v => v.uuid)[0],
                sid: Array.from(campaignTableFields.values()).filter(v => v.field_role === 'data').map(v => v.id)[0],
                date: new Date()
            })
        })
    }, [campaignParticipants, campaignTableFields, chartType, setParams])

    return { params, setParams };
}

export default useChartParams;