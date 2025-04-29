import { CampaignTable, CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import { Card } from "flowbite-react";
import FormatConfigTable from "../common/FormatConfigTable";
import { NewCampaignTable } from "@/hooks/create/useNewCampaignTables";

const CampaignTableCard: React.FC<{
    table: NewCampaignTable;
    removeTable: () => void,
    setChangedFields: (fieldId: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    addField: (field: CampaignTableField) => void
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ table, removeTable, setChangedFields, addField, setDailyCountThreshold, dailyCountThreshold }) => {
    return (
        <Card className="mb-2 shadow-none border-gray-300 rounded-lg">
            <div className="flex">
                <div className="grow">
                    <div className="text-lg font-semibold text-gray-900 whitespace-nowrap">{table.name}</div>
                    <div className="text-xs text-gray-900 whitespace-nowrap">{table.description}</div>
                </div>
                <div>
                    <span className="icon-[humbleicons--times] w-5 h-5 cursor-pointer" onClick={removeTable}></span>
                </div>
            </div>
            <div className="w-fit">
                <FormatConfigTable
                    currentTableFields={table.fields}
                    onFieldChange={setChangedFields}
                    addField={addField}
                    setDailyCountThreshold={setDailyCountThreshold}
                    dailyCountThreshold={dailyCountThreshold}
                />
            </div>

        </Card>
    )
}

export default CampaignTableCard;