'use client'

import { Button, Select } from "flowbite-react";
import FormatConfigTable from "../common/FormatConfigTable";
import { useEffect } from "react";
import { CampaignTableField } from "@/types/campaign";
import { useMemo } from "react";
import { useState } from "react";
import useCampaign from "@/hooks/useCampaign";
import { CampaignTable } from "@/types/campaign";

const DisplayConfiguration: React.FC = () => {
    const [currentTableId, setCurrentTableId] = useState<number | null>(null);
    const [dailyCountThreshold, setDailyCountThreshold] = useState<number>(0);
    const { campaignTables, campaignTableFields, updateCampaignField, updateCampaignTable } = useCampaign();
    const [changedFields, setChangedFields] = useState<Map<string, string>>(new Map());

    // Memoize current table and its fields
    const currentTable = useMemo((): CampaignTable | undefined => {
        console.log("currentTable", campaignTables.get(currentTableId!));
        return campaignTables.get(currentTableId!);
    }, [campaignTables, currentTableId]);

    const currentTableFields = useMemo((): CampaignTableField[] => {
        return Array.from(campaignTableFields.values()).filter((field) => field.campaign_table_id === currentTableId);
    }, [campaignTableFields, currentTableId]);

    // Initialize state
    useEffect(() => {
        if (campaignTables.size > 0 && !currentTableId) {
            setCurrentTableId(Array.from(campaignTables.keys())[0]);
        }
    }, [campaignTables, currentTableId]);

    // Update daily count threshold when table changes
    useEffect(() => {
        if (currentTable) {
            setDailyCountThreshold(currentTable.daily_count_max);
            setChangedFields(new Map());
        }
    }, [currentTable]);

    // Memoize change detection
    const hasChanged = useMemo(() =>
        changedFields.size > 0 || dailyCountThreshold !== currentTable?.daily_count_max,
        [changedFields, dailyCountThreshold, currentTable]);

    const updateChanges = async () => {
        console.log("updateChanges");
        if (changedFields.size > 0 && currentTableId) {
            const changes = Array.from(changedFields.entries()).map(([key, value]) => {
                const [type, id] = key.split("-");
                return {
                    id: parseInt(id),
                    campaign_table_id: currentTableId,
                    [type]: value
                };
            });
            await updateCampaignField(changes);
        }
        if (dailyCountThreshold !== currentTable?.daily_count_max && currentTableId) {
            console.log("updateCampaignTable", currentTableId, dailyCountThreshold);
            await updateCampaignTable(currentTableId, dailyCountThreshold);
        }
        setChangedFields(new Map());
    }

    if (!currentTableId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <h6 className="text-base font-medium text-gray-900 mb-2">
                Display Configuration
            </h6>
            <div className="flex gap-2 items-stretch">
                <Select
                    className="w-[200px]"
                    value={currentTableId}
                    onChange={(e) => setCurrentTableId(Number(e.target.value))}
                    id="table-select"
                >
                    {Array.from(campaignTables.values()).map((table) => (
                        <option key={table.id} value={table.id}>
                            {table.name}
                        </option>
                    ))}
                </Select>
                <Button
                    color="gray"
                    disabled={!hasChanged}
                    onClick={updateChanges}
                    className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100"
                >
                    {'Save'}
                </Button>
            </div>
            <FormatConfigTable
                currentTableFields={currentTableFields}
                onFieldChange={(fieldId, fieldName, fieldValue) => {
                    const field = currentTableFields.find(field => field.id == fieldId);
                    const currentValue = fieldName == 'role' ? field?.field_role : field?.field_type;
                    if (currentValue !== fieldValue) {
                        setChangedFields(prev => new Map(prev.set("field_role-" + fieldId.toString(), fieldValue)));
                    } else {
                        setChangedFields(prev => {
                            const newMap = new Map(prev);
                            newMap.delete("field_role-" + fieldId.toString());
                            return newMap;
                        });
                    }
                }}
                setDailyCountThreshold={setDailyCountThreshold}
                dailyCountThreshold={dailyCountThreshold}
            />

        </div>
    )
}

export default DisplayConfiguration;