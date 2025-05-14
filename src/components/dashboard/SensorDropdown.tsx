import useCampaign from "@/hooks/useCampaign";
import { Dropdown, DropdownDivider, DropdownItem, createTheme } from "flowbite-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const baseInnerTheme = {
    arrowIcon: "ml-auto h-4 w-4",
    floating: {
        target: "grow pl-3 pr-2 border-0 focus:ring-0 justify-start rounded-none",
    }
}

const SensorDropdown: React.FC<{
    selectedFields: { [key: number]: boolean }
    setSelectedFields: Dispatch<SetStateAction<{ [key: number]: boolean }>>
}> = ({ selectedFields, setSelectedFields }) => {
    const { campaignTables, mergedTabledFields: mergedTableFields } = useCampaign();
    const [selectedSensor, setSelectedSensor] = useState(-1)

    const dropdownLabel = useMemo(() => {
        const selectedId = Object.keys(selectedFields).filter(key => selectedFields[Number(key)])
        if (!selectedId || selectedId?.length == 0) {
            return "Select Sensor"
        }

        const selected = Number(selectedId[0])

        if (selectedId.length == 1) {
            return mergedTableFields.find(field => field.id == selected)?.displayName
        } else {
            return `${mergedTableFields.find(field => field.id == selected)?.displayName} + ${Object.values(selectedFields).filter(selected => selected).length - 1} more`
        }
    }, [selectedFields, mergedTableFields])

    const isAllSelected = useMemo(() => {
        return Array.from(campaignTables.values()).map(table =>
            mergedTableFields.filter(field => field.campaign_table_id === table.id).every(field => selectedFields[field.id])
        )
    }, [selectedFields, mergedTableFields, campaignTables])

    const innerTheme = createTheme(baseInnerTheme)
    const selectedInnerTheme = createTheme({
        ...baseInnerTheme,
        floating: {
            ...baseInnerTheme.floating,
            target: "grow pl-3 pr-2 border-0 focus:ring-0 justify-start bg-gray-100 rounded-none",
        }
    })

    return (
        <Dropdown
            label={dropdownLabel}
            placement="bottom-end"
            dismissOnClick={false}
            onMouseUp={() => setSelectedSensor(-1)}
        >
            {Array.from(campaignTables.values()).map((table, tidx) => (
                <div key={table.id} className="relative group">
                    <DropdownItem as="div" className="p-0 w-full">
                        <Dropdown
                            label={table.name}
                            placement="right-start"
                            dismissOnClick={false}
                            onMouseUp={() => { setSelectedSensor(selectedSensor === table.id ? -1 : table.id) }}
                            theme={selectedSensor === table.id ? selectedInnerTheme : innerTheme}
                            applyTheme="replace"
                            color="light"
                        >
                            {mergedTableFields.filter(field => field.campaign_table_id === table.id)
                                .map((field) => (
                                    <DropdownItem key={field.id} className="bg-white" onClick={() => {
                                        setSelectedFields(prev => ({
                                            ...prev,
                                            [field.id]: !prev[field.id]
                                        }));
                                    }}>
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedFields[field.id] || false}
                                            onChange={() => { }} // Add empty onChange to make it controlled
                                        />
                                        {field.name}
                                    </DropdownItem>
                                ))}
                            <DropdownDivider />
                            <DropdownItem className="font-bold" onClick={() => {
                                setSelectedFields(prev => {
                                    const keys = mergedTableFields.filter(field => field.campaign_table_id === table.id).map(field => field.id)
                                    const newSelectedFields = structuredClone(prev)
                                    keys.forEach(key => {
                                        newSelectedFields[key] = !isAllSelected[tidx]
                                    })
                                    return newSelectedFields
                                });
                            }}>
                                {
                                    isAllSelected[tidx] ?
                                        "Deselect all" :
                                        "Select all"
                                }
                            </DropdownItem>
                        </Dropdown>
                    </DropdownItem>
                </div>
            ))}
        </Dropdown>
    );
};

export default SensorDropdown;
