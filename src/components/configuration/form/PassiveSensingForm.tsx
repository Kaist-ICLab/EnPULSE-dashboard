'use client'
import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import PassiveSensingConfigTable from "../PassiveSensingConfigTable";
import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";

export default function PassiveSensingForm() {
    const { tables, removeTable, updateTableName, updateTableDisplayName, updateTableDescription } = useCampaignConfigEdit((state) => state);

    if (tables.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                <p className="text-gray-500 text-lg">No passive sensing is configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {tables.map((table, tableIndex) => (
                <Card key={tableIndex}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <IconButton
                                onClick={() => removeTable(tableIndex)}
                                hoverColor="red"
                                size="lg"
                                className="icon-[humbleicons--times]"
                            />
                            <div>
                                {table.is_custom ? (
                                    <SwitchingTextInput className="text-lg font-semibold text-gray-900 whitespace-nowrap" value={table.display_name} onChange={(value) => updateTableDisplayName(tableIndex, value)} />

                                ) : (
                                    <div className="px-2 py-1.5 text-lg font-semibold text-gray-900 whitespace-nowrap">{table.display_name}</div>
                                )}

                            </div>
                        </div>
                        <div className="mb-6">
                            {table.is_custom && (
                                <div className="flex flex-row items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        DB Table Name
                                    </span>
                                    <SwitchingTextInput sizing="sm" value={table.name ?? ''} onChange={(value) => updateTableName(tableIndex, value)} />
                                </div>
                            )}
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                    Description
                                </span>
                                <SwitchingTextInput sizing="sm" value={table.description ?? ''} onChange={(value) => updateTableDescription(tableIndex, value)} />
                            </div>
                        </div>
                        <PassiveSensingConfigTable
                            tableIdx={tableIndex}
                        />
                    </div>

                </Card>
            ))}
        </div>
    )
}
