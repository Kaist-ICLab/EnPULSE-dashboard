'use client'
import useAddSensorButtonState from "@/hooks/configuration/useAddSensorButtonState";
import { Button, Card, Dropdown, DropdownItem, TextInput } from "flowbite-react";

export default function AddSensorButtons() {
    const {
        sensorNameQuery,
        setSensorNameQuery,
        isSensorInputVisible,
        setCustomSensorInputVisibility,
        sensorName,
        setSensorName,
        sensorDescription,
        setSensorDescription,
        queryResultTables,
        addCustomSensorAsIs,
        addSensor,
        isCustomSensorNameReserved,
    } = useAddSensorButtonState();

    return (
        <div className="flex gap-4 items-center">
            <Dropdown label="Add sensors from template" enableTypeAhead={false}>
                <div className="px-2 mt-1 pb-2 border-b border-gray-300 relative">
                    <TextInput
                        sizing="sm"
                        placeholder="Search sensors..."
                        value={sensorNameQuery}
                        onChange={(e) => setSensorNameQuery(e.target.value)}
                    />
                    {sensorNameQuery.length > 0 && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => setSensorNameQuery("")}
                        >
                            <span className="icon-[humbleicons--times]"></span>
                        </button>
                    )}
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin mt-1">
                    {queryResultTables.length > 0 ? (
                        queryResultTables.map((table, idx) => (
                            <DropdownItem key={idx} onClick={() => addSensor(table)}>{table.display_name}</DropdownItem>
                        ))
                    ) : (
                        <DropdownItem disabled className="text-gray-400 hover:bg-white cursor-default">No sensors found</DropdownItem>
                    )}
                </div>
            </Dropdown>
            <Button
                className="border-gray-300 border-2 hover:bg-gray-100"
                color="white"
                onClick={() => { setCustomSensorInputVisibility(true) }}
            >
                <span className="icon-[tabler--plus] mr-2"></span> Add custom sensor
            </Button>
            {/* Custom sensor input */}
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
                    {isCustomSensorNameReserved && (
                        <p className="text-sm text-red-600 mb-2">
                            &quot;timing_sensor&quot; is a reserved name (used by the Timing Schedules feature) — choose another.
                        </p>
                    )}
                    <div className="flex gap-4 items-center">
                        <Button className="flex-2/3" disabled={isCustomSensorNameReserved} onClick={() => { addCustomSensorAsIs(); setCustomSensorInputVisibility(false) }}>
                            Confirm
                        </Button>
                        <Button className="flex-1/3" color="gray" onClick={() => { setCustomSensorInputVisibility(false) }}>
                            Cancel
                        </Button>
                    </div>
                </Card>
            )}
        </div>

    );
}
