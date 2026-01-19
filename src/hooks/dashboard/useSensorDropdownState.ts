import { useMemo, useState } from "react";
import { CampaignTable, CampaignTableFieldWithTable } from "@/types/campaign";

const useSensorDropdownState = (
    isFieldSelected: { [key: number]: boolean },
    campaignTables: Map<number, CampaignTable>,
    mergedTableFields: CampaignTableFieldWithTable[],
) => {
    const [selectedSensor, setSelectedSensor] = useState(-1);

    const dropdownLabel = useMemo(() => {
        const selectedId = Object.keys(isFieldSelected).filter(key => isFieldSelected[Number(key)]);
        if (!selectedId || selectedId?.length == 0) {
            return "Select Sensor";
        }

        const selected = Number(selectedId[0]);

        if (selectedId.length == 1) {
            return mergedTableFields.find(field => field.id == selected)?.displayName;
        } else {
            return `${mergedTableFields.find(field => field.id == selected)?.displayName} + ${Object.values(isFieldSelected).filter(selected => selected).length - 1} more`;
        }
    }, [isFieldSelected, mergedTableFields]);

    const isAllSelected = useMemo(() => {
        return new Map<number, boolean>(
            Array.from(campaignTables.values()).map((table) => {
                const allSelected = mergedTableFields
                    .filter((field) => field.campaign_table_id === table.id)
                    .every((field) => isFieldSelected[field.id]);
                return [table.id, allSelected];
            })
        );
    }, [isFieldSelected, mergedTableFields, campaignTables]);

    return {
        campaignTables,
        mergedTableFields,
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllSelected,
    };
};

export default useSensorDropdownState;
