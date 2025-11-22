import { useMemo } from "react";
import { NewCampaignTable } from "./useNewCampaignTables";
import { CampaignTableField } from "@/types/campaign";
import { createCampaign, createCampaignTable, createCampaignTableFields } from "@/services/campaignService";
import { useRouter } from "next/navigation";

export default function useAddCampaign(
    campaignName: string,
    isValidName: boolean,
    tables: NewCampaignTable[]
) {
    const router = useRouter()

    const isValid = useMemo(() => {
        if (!isValidName) return false

        if (tables.length == 0) return false
        if (tables.some(t => t.fields.length == 0)) return false

        return true
    }, [isValidName, tables])

    const submitCampaign = async () => {
        const campaignId = await createCampaign({ name: campaignName })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const insertedTables = tables.map(({ id, fields, isCustom, ...others }) => ({
            ...others,
            campaign_id: campaignId,
            description: '',
        }))

        const tableId = await createCampaignTable(insertedTables)
        const insertedTableFields = tables.map((t, i) => (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            t.fields.map(({ id, ...others }) => ({ ...others, campaign_id: campaignId, campaign_table_id: tableId[i] }))
        )).flat() as CampaignTableField[]

        const result = await createCampaignTableFields(insertedTableFields)
        if (result) router.push(`./${campaignId}/dashboard`)
    }

    return { isValid, submitCampaign }
}