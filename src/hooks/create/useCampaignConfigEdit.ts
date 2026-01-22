import { CampaignTableField, FieldRole, FieldType, NewCampaignTable } from "@/types/campaign";
import { create } from "zustand";
import { templateTable } from "./sensorTemplate";

interface CampaignConfigEditState {
    tables: NewCampaignTable[];
    availableTemplateTables: NewCampaignTable[];
    setDailyCountMax: (index: number, value: number) => void;
    addTable: (name: string, description: string, fields?: CampaignTableField[]) => void;
    addNewTemplateTable: (idx: number) => void;
    removeTable: (index: number) => void;
    addField: (tableIndex: number, field: CampaignTableField) => void;
    removeField: (tableIndex: number, fieldIdx: number) => void;
    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => void;
    reset: () => void;
}

const useCampaignConfigEdit = create<CampaignConfigEditState>((set) => ({
    tables: [],
    availableTemplateTables: templateTable,

    setDailyCountMax: (index: number, value: number) => {
        set((state) => {
            const newTables = [...state.tables];
            newTables.splice(index, 1, { ...state.tables[index], daily_count_max: value });
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addTable: (name: string, description: string, fields: CampaignTableField[] = []) => {
        set((state) => {
            const newTables = [...state.tables, { id: -1, campaign_id: -1, name, description, daily_count_max: 0, fields, isCustom: true }];
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addNewTemplateTable: (idx: number) => {
        set((state) => {
            const availableTables = templateTable.filter(t => !state.tables.some(t2 => t2.name == t.name));
            const newTables = [...state.tables, structuredClone(availableTables[idx])];
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    removeTable: (index: number) => {
        set((state) => {
            const newTables = [...state.tables];
            newTables.splice(index, 1);
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addField: (tableIndex: number, field: CampaignTableField) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const table = newTables[tableIndex];
            table.fields.forEach((v, i) => { v.id = i });
            field.id = table.fields.length;
            newTables[tableIndex].fields.push(field);
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    removeField: (tableIndex: number, fieldIdx: number) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            newTables[tableIndex].fields.splice(fieldIdx, 1);
            newTables[tableIndex].fields.forEach((v, i) => { v.id = i });
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const field = newTables[tableIndex].fields[fieldIdx];
            if (fieldName == 'role') {
                newTables[tableIndex].fields[fieldIdx] = { ...field, field_role: fieldValue as FieldRole };
            } else {
                newTables[tableIndex].fields[fieldIdx] = { ...field, field_type: fieldValue as FieldType };
            }
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            newTables[tableIndex].fields[fieldIdx] = { ...newTables[tableIndex].fields[fieldIdx], mapping };
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    reset: () => {
        set({
            tables: [],
            availableTemplateTables: templateTable
        });
    }
}));

export default useCampaignConfigEdit;
