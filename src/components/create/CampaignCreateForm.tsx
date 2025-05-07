'use client'

import { Button } from "flowbite-react"
import CampaignName from "./CampaignName"
import Link from "next/link"
import CampaignSensors from "./CampaignTables"
import { useState } from "react"
import useCampainTables from "@/hooks/create/useNewCampaignTables"
import useAddCampaign from "@/hooks/create/useAddCampaign"
export default function CampaignCreateForm() {
    const [campaignName, setCampaignName] = useState("");
    const [isValidName, setIsValidName] = useState(false);
    const { tables, addTable, removeTable, addField, setField, setDailyCountMax, addNewTemplateTable } = useCampainTables();
    const { isValid, submitCampaign } = useAddCampaign(campaignName, isValidName, tables)

    return (
        <div className="max-w-4xl flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create campaign</h1>
            <CampaignName
                campaignName={campaignName}
                setCampaignName={setCampaignName}
                setIsValidName={setIsValidName}
            />
            <CampaignSensors
                tables={tables}
                addTable={addTable}
                removeTable={removeTable}
                addField={addField}
                setField={setField}
                setDailyCountMax={setDailyCountMax}
                addNewTemplateTable={addNewTemplateTable}
            />
            <div className="w-full gap-4 flex mt-5">
                <Button className="flex-2/3" size="lg" disabled={!isValid} onClick={() => submitCampaign()}>
                    Create Campaign
                </Button>
                <Link href="/campaigns" className="flex-1/3" >
                    <Button className="w-full" size="lg" color="gray">
                        Cancel
                    </Button>
                </Link>
            </div>
        </div>
    )
}
