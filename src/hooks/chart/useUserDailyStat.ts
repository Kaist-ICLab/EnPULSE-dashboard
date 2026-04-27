import { getCampaignDailySummary } from "@/services/chartService";
import { useEffect, useMemo, useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { UserDailyStatData } from "@/types/dashboard";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";

export const useUserDailyStat = (initialRowsPerPage: number) => {
    const { date, lastManualSyncTime } = useSectionParamStore((state) => state);
    const { campaignParticipants, campaignTables } = useCampaignStore((state) => state);

    const [data, setData] = useState<UserDailyStatData[]>([])
    const [loading, setLoading] = useState(false)

    const [page, _setPage] = useState(1)
    const [rowsPerPage, _setRowsPerPage] = useState(initialRowsPerPage)

    const uuids = useMemo(() => {
        return Array.from(campaignParticipants.values()).filter((_, idx) => idx >= (page - 1) * rowsPerPage && idx < page * rowsPerPage).map(p => p.uuid)
    }, [campaignParticipants, page, rowsPerPage])

    const tableIds = useMemo(() => {
        return Array.from(campaignTables.values()).map(t => t.id)
    }, [campaignTables])

    const tableNames = useMemo(() => {
        if (data.length == 0) return campaignTables.values().map(t => t.display_name)

        const refrow = data[0].tables.map(t => t.table_id)
        return refrow.map(t => campaignTables.get(t)?.display_name ?? `TABLE_ID_${t}`)
    }, [data, campaignTables])

    const totalPage = useMemo(() => {
        return Math.ceil(Array.from(campaignParticipants.values()).length / rowsPerPage)
    }, [campaignParticipants, rowsPerPage])

    const setPage = (page: number) => {
        if (page < 1) {
            page = 1
        }
        if (page > totalPage) {
            page = totalPage
        }

        _setPage(page)
    }

    const setRowsPerPage = (newRowsPerPage: number) => {
        _setRowsPerPage(newRowsPerPage)
        setPage(1)
    }


    // 각각의 campaign_table에 대해서 최대 count의 값을 계산
    const maxDailyCount = useMemo(() => {
        const res = new Map<number, number>()

        for (const row of data) {
            for (const table of row.tables) {
                const rowMax = table.counts.reduce((acc, count) => Math.max(acc, count), 0)
                res.set(table.table_id, Math.max(res.get(table.table_id) ?? 0, rowMax))
            }
        }

        campaignTables.entries().forEach(([tableId, table]) => {
            if (table.daily_count_max > 0) res.set(tableId, table.daily_count_max)
        })

        return res
    }, [data, campaignTables])

    // In practice, this should be calculated by the server as the client cannot see all the data?

    useEffect(() => {
        if (uuids.length == 0) return

        const load = async () => {
            const statData = await getCampaignDailySummary(uuids, tableIds, date)

            setData(statData)
            setLoading(false)
        }

        setLoading(true)
        load()

    }, [date, page, rowsPerPage, totalPage, uuids, lastManualSyncTime, tableIds])

    return { data, maxDailyCount, tableNames, loading, page, rowsPerPage, totalPage, setPage, setRowsPerPage }
}

export default useUserDailyStat