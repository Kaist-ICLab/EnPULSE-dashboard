import { getCampaignDailySummary, getDailyStatCount } from "@/services/chartService";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import useCampaign from "../useCampaign";

export type UserDailyStat = {
    uuid: string;
    email: string;
    contacts: number;
    columns: {
        [name: string]: DynamicDataColumn;
    };
};

// export type DynamicDataColumn = {
//     dailyCount: number;
//     timeline: number[];
// };

export type DynamicDataColumn = {
    dailyCount: number;
    timeline: number[];
};

export const useUserDailyStat = (
    date: Date,
    page: number,
    rowsPerPage: number,
    setTotalPage: Dispatch<SetStateAction<number>>,
    syncTime: Date | null
) => {
    const { selectedCampaignId } = useCampaign()
    const [data, setData] = useState<UserDailyStat[]>([])
    const [loading, setLoading] = useState(true)

    const columns = useMemo(() => {
        return data.length > 0 ? Object.keys(data[0].columns) : []
    }, [data])

    const maxDailyCount = useMemo(() => {
        const res = {} as { [name: string]: number }
        columns.forEach(key => {
            res[key] = 100
        })

        return res
    }, [columns])

    // // In practice, this should be calculated by the server as the client cannot see all the data
    // const maxDailyCount = useMemo(() => {
    //     const result: { [key: string]: number } = {};
    //     columns.forEach(column => {
    //         result[column] = fakeData.reduce((max, user) => {
    //             return Math.max(max, user.columns[column].dailyCount);
    //         }, 0);
    //     });
    //     return result;
    // }, [columns]);

    useEffect(() => {
        if (!selectedCampaignId) return

        const load = async () => {
            const count = await getDailyStatCount(selectedCampaignId)
            const statData = await getCampaignDailySummary(selectedCampaignId, page, rowsPerPage)

            setTotalPage(Math.ceil(count ? count / rowsPerPage : 0))
            setData(statData)
            setLoading(false)
        }

        setLoading(true)
        load()
    }, [page, rowsPerPage, setTotalPage, selectedCampaignId, syncTime])

    return { data, columns, maxDailyCount, loading }
}

export default useUserDailyStat