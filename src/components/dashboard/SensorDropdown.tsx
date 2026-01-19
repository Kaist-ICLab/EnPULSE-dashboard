import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";
import useCampaign from "@/hooks/useCampaign";
import useSensorDropdownState from "@/hooks/dashboard/useSensorDropdownState";

const SensorDropdown: React.FC<{
    isFieldSelected: { [key: number]: boolean }
    setIsFieldSelected: Dispatch<SetStateAction<{ [key: number]: boolean }>>,
    isMultipleSelection: boolean,
}> = ({ isFieldSelected, setIsFieldSelected }) => {
    const { campaignTables, mergedTabledFields: mergedTableFields } = useCampaign();
    const {
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllSelected,
    } = useSensorDropdownState(isFieldSelected, campaignTables, mergedTableFields);

    return (
        <Dropdown
            label={dropdownLabel}
            placement="bottom-start"
            dismissOnClick={false}
            onMouseUp={() => setSelectedSensor(-1)}
        >
            <div className="max-h-64 flex flex-row py-2 gap-2">
                <div className="overflow-y-auto scrollbar-thin">
                    {Array.from(campaignTables.values()).map((table) => (
                        <DropdownItem
                            key={table.id}
                            className={`font-medium ${selectedSensor === table.id ? 'text-blue-600 bg-gray-100' : 'text-gray-700'}`}
                            onClick={() => { setSelectedSensor(selectedSensor === table.id ? -1 : table.id) }}
                        >
                            {table.name}
                        </DropdownItem>
                    ))}
                </div>
                {selectedSensor !== -1 && (
                    <div className="min-w-48 flex flex-col">
                        <div className="overflow-y-auto grow scrollbar-thin">
                            {mergedTableFields.filter(field => field.campaign_table_id === selectedSensor)
                                .map((field) => (
                                    <DropdownItem key={field.id} className="bg-white" onClick={() => {
                                        setIsFieldSelected(prev => ({
                                            ...prev,
                                            [field.id]: !prev[field.id]
                                        }));
                                    }}>
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={isFieldSelected[field.id] || false}
                                            onChange={() => { }} // Add empty onChange to make it controlled
                                        />
                                        {field.name}
                                    </DropdownItem>
                                ))}
                        </div>
                        <DropdownDivider />
                        <DropdownItem className="font-bold" onClick={() => {
                            setIsFieldSelected(prev => {
                                const keys = mergedTableFields.filter(field => field.campaign_table_id === selectedSensor).map(field => field.id)
                                const newSelectedFields = structuredClone(prev)
                                keys.forEach(key => {
                                    newSelectedFields[key] = !(isAllSelected.get(selectedSensor) ?? false)
                                })
                                return newSelectedFields
                            });
                        }}>
                            {
                                (isAllSelected.get(selectedSensor) ?? false) ?
                                    "Deselect all" :
                                    "Select all"
                            }
                        </DropdownItem>
                    </div>
                )}
            </div>
        </Dropdown>
    );
};

export default SensorDropdown;
