import { CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import FormatConfigTable from "./FormatConfigTable";
import { CampaignTable } from "@/types/campaign";

const CampaignTableCard: React.FC<{
    table: CampaignTable;
    setChangedFields: (fieldId: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    addField: (field: CampaignTableField) => void
    removeField?: (fieldIdx: number) => void;
    setFieldMapping?: (fieldIdx: number, mapping: { value: string, display: string }[]) => void;
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ table, setChangedFields, addField, removeField, setFieldMapping, setDailyCountThreshold, dailyCountThreshold }) => {
    return (
        <FormatConfigTable
            currentTableFields={table.campaign_table_field}
            onFieldChange={setChangedFields}
            addField={addField}
            removeField={removeField}
            onMappingChange={setFieldMapping}
            setDailyCountThreshold={setDailyCountThreshold}
            dailyCountThreshold={dailyCountThreshold}
            canAddField={table.is_custom}
        />
    )
}

export default CampaignTableCard;