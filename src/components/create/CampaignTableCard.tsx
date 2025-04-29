import { CampaignTable, CampaignTableField } from "@/types/campaign";
import { Card } from "flowbite-react";
import FormatConfigTable from "../common/FormatConfigTable";
import { NewCampainTable, NewCampainTableField } from "@/hooks/create/useCampainTables";
const CampaignTableCard: React.FC<{
    table: NewCampainTable;
    currentTableFields: NewCampainTableField[];
    setChangedFields: (callback: (prev: Map<string, string>) => Map<string, string>) => void;
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ table, currentTableFields, setChangedFields, setDailyCountThreshold, dailyCountThreshold }) => {


    return (
        <Card className="mb-2 shadow-none border-gray-300 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 whitespace-nowrap">{table.name}</div>
            <div className="text-xs text-gray-900 whitespace-nowrap">{table.description}</div>
            <FormatConfigTable
                currentTableFields={currentTableFields}
                setChangedFields={setChangedFields}
                setDailyCountThreshold={setDailyCountThreshold}
                dailyCountThreshold={dailyCountThreshold}
            />
        </Card>
    )
}

export default CampaignTableCard;