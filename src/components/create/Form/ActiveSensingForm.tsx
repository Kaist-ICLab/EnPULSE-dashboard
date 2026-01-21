'use client'
import CampaignSensors from "../CampaignTables"
import useNewCampainTables from "@/hooks/create/useNewCampaignTables"
export default function ActiveSensingForm() {
    const { tables, addTable, removeTable, addField, setField, setDailyCountMax, addNewTemplateTable, availableTemplateTables } = useNewCampainTables();

    return (
        <div className="max-w-4xl flex flex-col gap-6">
            <CampaignSensors
                tables={tables}
                addTable={addTable}
                removeTable={removeTable}
                addField={addField}
                setField={setField}
                setDailyCountMax={setDailyCountMax}
                addNewTemplateTable={addNewTemplateTable}
                availableTemplateTables={availableTemplateTables}
            />
        </div>
    )
}
