'use client'

import useCampaign from "@/hooks/useCampaign";
import { CampaignTable, CampaignTableField, FieldRoleOption, FieldTypeOption } from "@/types/campaign";
import { Button, Select, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";

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
    [changedFields, dailyCountThreshold, currentTable, campaignTables]);

    const updateChanges = async () => {
        console.log("updateChanges");
        if(changedFields.size > 0 && currentTableId) {
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
        if(dailyCountThreshold !== currentTable?.daily_count_max && currentTableId) {
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
            <Table className="w-fit">
                <TableHead>
                    <TableRow>
                        {["field name", "field role", "field type"].map((header) => (
                            <TableHeadCell key={header}>{header}</TableHeadCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentTableFields.map((field) => (
                        <TableRow key={field.id} className="bg-white text-gray-900">
                            <TableCell>{field.name}</TableCell>
                            <TableCell>
                                <select
                                    className="w-[120px] bg-transparent focus:outline-none p-2 shadow-none"
                                    defaultValue={field.field_role}
                                    onChange={(e) => {
                                        if(e.target.value !== field.field_role) {
                                            setChangedFields(prev => new Map(prev.set("field_role-"+field.id.toString(), e.target.value)));
                                        }else{
                                            setChangedFields(prev => {
                                                const newMap = new Map(prev);
                                                newMap.delete("field_role-"+field.id.toString());
                                                return newMap;
                                            });
                                        }
                                    }}
                                >
                                    {FieldRoleOption.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </TableCell>
                            <TableCell>
                                <select
                                    className="w-[120px] bg-transparent focus:outline-none p-2 shadow-none"
                                    defaultValue={field.field_type}
                                    onChange={(e) => {
                                        if(e.target.value !== field.field_type) {
                                            setChangedFields(prev => new Map(prev.set("field_type-"+field.id.toString(), e.target.value)));
                                        }else{
                                            setChangedFields(prev => {
                                                const newMap = new Map(prev);
                                                newMap.delete("field_type-"+field.id.toString());
                                                return newMap;
                                            });
                                        }
                                    }}
                                >
                                    {FieldTypeOption.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="w-fit mt-3 flex flex-col border-1 border-gray-200 divide-y divide-gray-200">
                <div className="flex divide-x divide-gray-200">
                    <div className="bg-gray-50 px-4 py-3 uppercase text-sm">
                        Daily Count Threshold
                    </div>
                    <input
                        type="number"
                        value={dailyCountThreshold}
                        onChange={(e) => setDailyCountThreshold(Number(e.target.value))}
                        className="w-[80px] outline-none focus:outline-none pl-3"
                    />
                </div>
            </div>
        </div>
    );
};

export default DisplayConfiguration;

