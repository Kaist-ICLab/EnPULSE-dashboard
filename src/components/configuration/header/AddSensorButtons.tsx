'use client'
import { useState } from "react";
import { Button, Card, Dropdown, DropdownItem, TextInput } from "flowbite-react";
import useNewCampainTables from "@/hooks/useCampaignConfigEdit";

export default function AddSensorButtons() {
    const { addTable, addNewTemplateTable, availableTemplateTables } = useNewCampainTables();
    const [isSensorInputVisible, setIsSensorInputVisible] = useState(false);
    const [sensorName, setSensorName] = useState("");
    const [sensorDescription, setSensorDescription] = useState("");

    return (
        <div className="flex gap-4 items-center">
            <Dropdown label="Add sensors from template">
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                    {availableTemplateTables.map((table, idx) => (
                        <DropdownItem key={idx} onClick={() => addNewTemplateTable(idx)}>{table.name}</DropdownItem>
                    ))}
                </div>
            </Dropdown>
            <Button
                className="border-gray-300 border-2 hover:bg-gray-100"
                color="white"
                onClick={() => { setIsSensorInputVisible(true); setSensorName(""); setSensorDescription("") }}
            >
                <span className="icon-[tabler--plus] mr-2"></span> Add custom sensor
            </Button>
            {isSensorInputVisible && (
                <Card className="absolute right-6 top-20 z-10 shadow-lg min-w-96">
                    <div className="flex gap-4 items-center mb-4">
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Sensor Name</span>
                        <TextInput
                            type="text"
                            placeholder="Sensor name"
                            className="w-full"
                            value={sensorName}
                            onChange={(e) => setSensorName(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 items-center mb-4">
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
                        <Button className="flex-2/3" onClick={() => { addTable(sensorName, sensorDescription); setIsSensorInputVisible(false); setSensorName(""); setSensorDescription(""); }}>
                            Confirm
                        </Button>
                        <Button className="flex-1/3" color="gray" onClick={() => { setIsSensorInputVisible(false); setSensorName(""); setSensorDescription(""); }}>
                            Cancel
                        </Button>
                    </div>
                </Card>
            )}
        </div>

    );
}
