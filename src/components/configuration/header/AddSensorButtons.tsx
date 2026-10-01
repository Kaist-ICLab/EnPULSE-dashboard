"use client";
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
    customSensorNameError,
  } = useAddSensorButtonState();

  return (
    <div className="flex items-center gap-4">
      <Dropdown label="Add sensors from template" enableTypeAhead={false}>
        <div className="relative mt-1 border-b border-gray-300 px-2 pb-2">
          <TextInput
            sizing="sm"
            placeholder="Search sensors..."
            value={sensorNameQuery}
            onChange={(e) => setSensorNameQuery(e.target.value)}
          />
          {sensorNameQuery.length > 0 && (
            <button
              type="button"
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setSensorNameQuery("")}
            >
              <span className="icon-[humbleicons--times]"></span>
            </button>
          )}
        </div>
        <div className="mt-1 max-h-64 scrollbar-thin overflow-y-auto">
          {queryResultTables.length > 0 ? (
            queryResultTables.map((table, idx) => (
              <DropdownItem key={idx} onClick={() => addSensor(table)}>
                {table.display_name}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem disabled className="cursor-default text-gray-400 hover:bg-white">
              No sensors found
            </DropdownItem>
          )}
        </div>
      </Dropdown>
      <Button
        className="border-2 border-gray-300 hover:bg-gray-100"
        color="white"
        onClick={() => {
          setCustomSensorInputVisibility(true);
        }}
      >
        <span className="icon-[tabler--plus] mr-2"></span> Add custom sensor
      </Button>
      {/* Custom sensor input */}
      {isSensorInputVisible && (
        <Card className="absolute top-20 right-6 z-10 min-w-96 shadow-lg">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap text-gray-900">Sensor Name</span>
            <TextInput
              type="text"
              placeholder="Sensor name"
              className="w-full"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap text-gray-900">Description (Optional)</span>
            <TextInput
              type="text"
              placeholder="Description"
              className="w-full"
              value={sensorDescription}
              onChange={(e) => setSensorDescription(e.target.value)}
            />
          </div>
          {/* An empty name just disables Confirm; other problems are explained. */}
          {customSensorNameError && sensorName.trim().length > 0 && (
            <p className="mb-2 text-sm text-red-600">{customSensorNameError}</p>
          )}
          <div className="flex items-center gap-4">
            <Button
              className="flex-2/3"
              disabled={customSensorNameError !== null}
              onClick={() => {
                addCustomSensorAsIs();
                setCustomSensorInputVisibility(false);
              }}
            >
              Confirm
            </Button>
            <Button
              className="flex-1/3"
              color="gray"
              onClick={() => {
                setCustomSensorInputVisibility(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
