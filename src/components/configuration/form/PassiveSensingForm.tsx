'use client'
import { Card } from "flowbite-react";
import useNewCampainTables from "@/hooks/useCampaignConfigEdit";
import CampaignTableCard from "../CampaignTableCard";
import RemoveIconButton from "../RemoveIconButton";

export default function PassiveSensingForm() {
    const { tables, removeTable, addField, removeField, setField, setFieldMapping, setDailyCountMax } = useNewCampainTables();

    if (tables.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                <p className="text-gray-500 text-lg">No passive sensing is configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div role="campaign-sensors" className="flex flex-col gap-4">
                {tables.map((table, tableIndex) => (
                    <Card key={tableIndex}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <RemoveIconButton
                                    onClick={() => removeTable(tableIndex)}
                                    size="md"
                                />
                                <div>
                                    <div className="text-lg font-semibold text-gray-900 whitespace-nowrap">{table.name}</div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">{table.description}</div>
                                </div>
                            </div>
                        </div>
                        <CampaignTableCard
                            table={table}
                            setChangedFields={(id, name, value) => setField(tableIndex, id, name, value)}
                            addField={field => addField(tableIndex, field)}
                            removeField={fieldIdx => removeField(tableIndex, fieldIdx)}
                            setFieldMapping={(fieldIdx, mapping) => setFieldMapping(tableIndex, fieldIdx, mapping)}
                            setDailyCountThreshold={v => setDailyCountMax(tableIndex, v)}
                            dailyCountThreshold={table.daily_count_max}
                        />
                    </Card>
                ))}
            </div>
        </div>
    )
}
