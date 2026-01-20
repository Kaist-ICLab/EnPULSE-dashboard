import { useMemo, useState, useCallback } from "react";
import { CampaignTable, CampaignTableFieldWithTable } from "@/types/campaign";

const useSensorDropdownState = (
    selectedFieldIds: number[],
    campaignTables: Map<number, CampaignTable>,
    mergedTableFields: CampaignTableFieldWithTable[],
    setSelectedFieldIds: (fieldIds: number[]) => void,
    isMultipleSelection: boolean,
) => {
    const [selectedSensor, setSelectedSensor] = useState(-1);

    const selectedFields = useMemo(() => mergedTableFields.filter(field => selectedFieldIds.includes(field.id)), [selectedFieldIds, mergedTableFields]);

    const dropdownLabel = useMemo(() => {
        if (selectedFieldIds.length == 0) {
            return "Select Sensor";
        }

        if (selectedFieldIds.length == 1) {
            return mergedTableFields.find(field => field.id == selectedFieldIds[0])?.display_name;
        } else {
            return `${mergedTableFields.find(field => field.id == selectedFieldIds[0])?.display_name} + ${selectedFieldIds.length - 1} more`;
        }
    }, [selectedFieldIds, mergedTableFields]);

    const isAllSelected = useMemo(() => {
        return new Map<number, boolean>(
            Array.from(campaignTables.values()).map((table) => {
                const allSelected = mergedTableFields
                    .filter((field) => field.campaign_table_id === table.id)
                    .every((field) => selectedFieldIds.includes(field.id));
                return [table.id, allSelected];
            })
        );
    }, [selectedFieldIds, mergedTableFields, campaignTables]);

    const toggleFieldSelection = useCallback((fieldId: number) => {
        if (isMultipleSelection) {
            if (selectedFieldIds.includes(fieldId)) {
                setSelectedFieldIds(selectedFieldIds.filter(id => id !== fieldId));
            } else {
                setSelectedFieldIds([...selectedFieldIds, fieldId]);
            }
        } else {
            if (selectedFieldIds.includes(fieldId)) {
                setSelectedFieldIds([]);
            } else {
                setSelectedFieldIds([fieldId]);
            }
        }
    }, [selectedFieldIds, isMultipleSelection, setSelectedFieldIds]);

    const toggleAllFieldsSelection = useCallback((campaignTableId: number) => {
        const fieldIds = mergedTableFields.filter(field => field.campaign_table_id === campaignTableId).map(field => field.id);
        if (isAllSelected.get(campaignTableId) ?? false) {
            setSelectedFieldIds(selectedFieldIds.filter(id => !fieldIds.includes(id)));
        } else {
            setSelectedFieldIds([...selectedFieldIds, ...fieldIds]);
        }
    }, [selectedFieldIds, isAllSelected, setSelectedFieldIds, mergedTableFields]);

    return {
        selectedFields,
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllSelected,
        toggleFieldSelection,
        toggleAllFieldsSelection,
    };
};

export default useSensorDropdownState;
