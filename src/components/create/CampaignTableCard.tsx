import { CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import FormatConfigTable from "../common/FormatConfigTable";
import { NewCampaignTable } from "@/hooks/create/useNewCampaignTables";

const CampaignTableCard: React.FC<{
    table: NewCampaignTable;
    setChangedFields: (fieldId: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    addField: (field: CampaignTableField) => void
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ table, setChangedFields, addField, setDailyCountThreshold, dailyCountThreshold }) => {
    return (
        <FormatConfigTable
            currentTableFields={table.fields}
            onFieldChange={setChangedFields}
            addField={addField}
            setDailyCountThreshold={setDailyCountThreshold}
            dailyCountThreshold={dailyCountThreshold}
            canAddField={table.isCustom}
        />
    )
}

export default CampaignTableCard;