import { useMemo } from "react";
import { NewCampaignTable } from "./useNewCampaignTables";
import { Campaign, CampaignTable, CampaignTableField } from "@/types/campaign";
import { createCampaign, createCampaignTable, createCampaignTableFields } from "@/services/campaignService";
import { useRouter } from "next/router";

export default function useAddCampaign(
    campaignName: string,
    tables: NewCampaignTable[]
) {
    const router = useRouter()

    const isValid = useMemo(() => {
        if (campaignName === '') return false

        if (tables.length == 0) return false
        if (tables.some(t => t.fields.length == 0)) return false

        return true
    }, [campaignName, tables])

    const submitCampaign = async () => {
        const campaignId = await createCampaign({ name: campaignName })

        const insertedTables = tables.map(t => ({
            ...t,
            id: -1,
            campaign_id: campaignId,
            description: '',
        } as CampaignTable))

        const tableId = await createCampaignTable(insertedTables)
        const insertedTableFields = tables.map((t, i) => (
            t.fields.map(tf => ({ ...tf, campaign_id: campaignId, campaign_table_id: tableId[i] }))
        )).flat() as CampaignTableField[]

        const result = await createCampaignTableFields(insertedTableFields)

        if (result) router.push(`../${campaignId}/dashboard`)
    }

    return { isValid, submitCampaign }
}