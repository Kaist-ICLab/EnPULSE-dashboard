import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import useCampaign from "@/hooks/useCampaign";
import useSensorDropdownState from "@/hooks/dashboard/useSensorDropdownState";

const SensorDropdown: React.FC<{
    className?: string;
    selectedFieldIds: number[]
    setSelectedFieldIds: (fieldId: number[]) => void,
    isMultipleSelection: boolean,
}> = ({ className, selectedFieldIds, setSelectedFieldIds, isMultipleSelection }) => {
    const { campaignTables, campaignTableFields } = useCampaign();
    const {
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllSelected,
        toggleFieldSelection,
        toggleAllFieldsSelection,
        selectedCountByTable,
    } = useSensorDropdownState(selectedFieldIds, campaignTables, campaignTableFields, setSelectedFieldIds, isMultipleSelection);

    return (
        <Dropdown
            label={dropdownLabel}
            placement="bottom-start"
            dismissOnClick={false}
            onMouseUp={() => setSelectedSensor(-1)}
            className={className}
        >
            <div className="h-64 flex flex-row px-2 py-2 gap-2">
                <div className="min-w-56 flex flex-col">
                    <div className="overflow-y-auto grow scrollbar-thin">
                        {Array.from(campaignTables.values()).map((table) => (
                            <DropdownItem
                                key={table.id}
                                className={`font-medium ${selectedSensor === table.id ? 'text-blue-600 bg-gray-100' : 'text-gray-700'}`}
                                onClick={() => { setSelectedSensor(selectedSensor === table.id ? -1 : table.id) }}
                            >
                                <span className="flex items-center">
                                    <span>{table.name}</span>
                                    {isMultipleSelection ? (
                                        (selectedCountByTable.get(table.id) || 0) > 0 && (
                                            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs w-5 h-5">
                                                {selectedCountByTable.get(table.id)}
                                            </span>
                                        )
                                    ) : (
                                        (selectedCountByTable.get(table.id) || 0) > 0 && (
                                            <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-blue-500" />
                                        )
                                    )}
                                </span>
                            </DropdownItem>
                        ))}
                    </div>
                    <DropdownDivider />
                    <DropdownItem className="font-bold" onClick={() => setSelectedFieldIds([])}>
                        <span className="text-red-500">{isMultipleSelection ? "Deselect all" : "Deselect"}</span>
                    </DropdownItem>
                </div>
                {selectedSensor === -1 ? (
                    <div className="min-w-40 flex items-center justify-center bg-gray-50 rounded-sm">
                        <span className="text-gray-400 text-sm ">Select Sensor</span>
                    </div>
                ) : (
                    <div className="min-w-40 flex flex-col">
                        <div className="overflow-y-auto grow scrollbar-thin">
                            {campaignTables.get(selectedSensor)?.campaign_table_field.map((field) => (
                                <DropdownItem key={field.id} className="bg-white" onClick={() => {
                                    toggleFieldSelection(field.id);
                                }}>
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedFieldIds.includes(field.id)}
                                        onChange={() => { }} // Add empty onChange to make it controlled
                                    />
                                    {field.name}
                                </DropdownItem>
                            ))}
                        </div>
                        <DropdownDivider />
                        {isMultipleSelection && (
                            <DropdownItem className="font-bold" onClick={() => toggleAllFieldsSelection(selectedSensor)}>
                                {
                                    (isAllSelected.get(selectedSensor) ?? false) ?
                                        "Deselect all fields" :
                                        "Select all fields"
                                }
                            </DropdownItem>
                        )}
                    </div>
                )}
            </div>
        </Dropdown>
    );
};

export default SensorDropdown;
