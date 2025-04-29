import { CampaignTable, CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import { useState } from "react";


export interface NewCampainTableField extends Omit<CampaignTableField, 'id' | 'campaign_table_id'> {
    description: string;
}

export interface NewCampainTable extends Omit<CampaignTable, 'id' | 'campaign_id'> {
    description: string;
    fields: NewCampainTableField[];
}


export default function useCampainTables() {
    const [tables, setTables] = useState<NewCampainTable[]>([]);

    const addTable = (name: string, description: string) => {
        setTables([...tables, { name, description, daily_count_max: 0, fields: [] }]);
    }

    // const setChangedFields = 

    return {
        tables,
        addTable,
    };
}
