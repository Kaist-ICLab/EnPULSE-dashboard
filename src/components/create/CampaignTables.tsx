'use client'

import { useState } from "react";

import { NewCampaignTable } from "@/hooks/create/useNewCampaignTables";
import { Button, Card, TextInput } from "flowbite-react";
import CampaignTableCard from "./CampaignTableCard";
import { CampaignTableField, FieldRole, FieldType } from "@/types/campaign";

const CampaignSensors: React.FC<{
    tables: NewCampaignTable[],
    addTable: (name: string, description: string) => void,
    removeTable: (index: number) => void,
    setDailyCountMax: (index: number, value: number) => void,
    addField: (tableIndex: number, field: CampaignTableField) => void
    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void,
}> = ({ tables, addTable, removeTable, setDailyCountMax, addField, setField }) => {
    const [isSensorInputVisible, setIsSensorInputVisible] = useState(false);
    const [sensorName, setSensorName] = useState("");
    const [sensorDescription, setSensorDescription] = useState("");

    return (
        <div role="campaign-sensors">
            <h6 className="text-xl font-medium text-gray-900 mb-2">
                Campaign sensors
            </h6>
            {
                tables.map((table, tableIndex) =>
                    <CampaignTableCard
                        key={tableIndex}
                        table={table}
                        removeTable={() => removeTable(tableIndex)}
                        setChangedFields={(id, name, value) => setField(tableIndex, id, name, value)}
                        addField={field => addField(tableIndex, field,)}
                        setDailyCountThreshold={v => setDailyCountMax(tableIndex, v)}
                        dailyCountThreshold={table.daily_count_max}
                    />
                )
            }
            {isSensorInputVisible ? (<Card className="shadow-none bg-gray-50 border-gray-300 rounded-lg">
                <div className="flex gap-4 items-center">
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Sensor Name</span>
                    <TextInput
                        type="text"
                        placeholder="Sensor name"
                        className="w-full"
                        value={sensorName}
                        onChange={(e) => setSensorName(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Description (Optional)</span>
                    <TextInput
                        type="text"
                        placeholder="Description"
                        className="w-full"
                        value={sensorDescription}
                        onChange={(e) => setSensorDescription(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <Button className="flex-2/3" onClick={() => { addTable(sensorName, sensorDescription); setIsSensorInputVisible(false) }}>
                        Confirm
                    </Button>
                    <Button className="flex-1/3" color="gray" onClick={() => setIsSensorInputVisible(false)}>
                        Cancel
                    </Button>
                </div>

            </Card>) :
                <Button className="w-full mt-3 border-gray-300 border-2 hover:bg-gray-100" color="white" size="lg" onClick={() => { setIsSensorInputVisible(true); setSensorName(""); setSensorDescription("") }}>
                    <span className="icon-[tabler--plus] mr-2"></span> Add sensor
                </Button>
            }

        </div>
    );
};

export default CampaignSensors; 