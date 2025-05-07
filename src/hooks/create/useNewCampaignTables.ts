import { CampaignTable, CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import { useState } from "react";
import { templateTable } from "./sensorTemplate";

export interface NewCampaignTable extends CampaignTable {
    description: string;
    fields: CampaignTableField[];
}

export default function useCampainTables() {
    const [tables, setTables] = useState<NewCampaignTable[]>([]);

    const setDailyCountMax = (index: number, value: number) => {
        setTables(tables => {
            const newTable = [...tables]
            newTable.splice(index, 1, { ...tables[index], daily_count_max: value })
            return newTable
        })
    }

    const addTable = (name: string, description: string, fields: CampaignTableField[] = []) => {
        setTables([...tables, { id: -1, campaign_id: -1, name, description, daily_count_max: 0, fields }]);
    }

    const addNewTemplateTable = (idx: number) => {
        setTables([...tables, structuredClone(templateTable[idx])])
    }

    const removeTable = (index: number) => {
        setTables(tables => {
            const newTable = [...tables]
            newTable.splice(index, 1)
            return newTable
        })
    }

    const addField = (tableIndex: number, field: CampaignTableField,) => {
        const table = tables[tableIndex]
        table.fields.forEach((v, i) => { v.id = i })

        field.id = table.fields.length
        const newTables = structuredClone(tables)
        newTables[tableIndex].fields.push(field)
        setTables(newTables)
    }

    const setField = (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => {
        const table = tables[tableIndex]
        const field = table.fields[fieldIdx]

        const newTables = structuredClone(tables)
        if (fieldName == 'role') {
            newTables[tableIndex].fields[fieldIdx] = { ...field, field_role: fieldValue as FieldRole }
        } else {
            newTables[tableIndex].fields[fieldIdx] = { ...field, field_type: fieldValue as FieldType }
        }

        setTables(newTables)
    }

    return {
        tables,
        addTable,
        addNewTemplateTable,
        removeTable,
        addField,
        setField,
        setDailyCountMax
    };
}
