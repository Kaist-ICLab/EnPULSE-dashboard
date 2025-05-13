import useCampaign from "@/hooks/useCampaign";
import { Dropdown, DropdownDivider, DropdownItem, createTheme } from "flowbite-react";
import { useMemo, useState } from "react";

const baseInnerTheme = {
    arrowIcon: "ml-auto h-4 w-4",
    floating: {
        target: "grow pl-3 pr-2 border-0 focus:ring-0 justify-start rounded-none",
    }
}

const SensorDropdown: React.FC = () => {
    const { campaignTables, campaignTableFields, mergedTabledFields: mergedTableFields } = useCampaign();
    const [selectedSensor, setSelectedSensor] = useState(-1)
    const [selectedFields, setSelectedFields] = useState<{ [key: number]: boolean }>(mergedTableFields.reduce((acc, field) => {
        acc[field.id] = false
        return acc
    }, {} as { [key: number]: boolean }))

    const dropdownLabel = useMemo(() => {
        const selectedId = Object.keys(selectedFields).find(key => selectedFields[Number(key)])
        if (!selectedId || selectedId?.length == 0) {
            return "Select Sensor"
        } else if (selectedId.length == 1) {
            return mergedTableFields.find(field => field.id == Number(selectedId))?.displayName
        } else {
            return `${mergedTableFields.find(field => field.id == Number(selectedId))?.displayName} + ${Object.values(selectedFields).filter(selected => selected).length - 1} more`
        }
    }, [selectedFields, mergedTableFields])

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
            label="Select Sensor"
            placement="bottom-start"
            dismissOnClick={false}
            onClick={() => setSelectedSensor(-1)}
        >
            {Array.from(campaignTables.values()).map((table) => (
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
                            {Array.from(campaignTableFields.values())
                                .filter(field => field.campaign_table_id === table.id)
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
                            <DropdownItem className="font-bold">
                                Select all
                            </DropdownItem>
                        </Dropdown>
                    </DropdownItem>
                </div>
            ))}
        </Dropdown>
    );
};

export default SensorDropdown;
