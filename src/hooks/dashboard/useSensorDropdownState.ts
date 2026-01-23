import { useMemo, useState, useCallback } from "react";
import { CampaignTable, CampaignTableField } from "@/types/campaign";

const useSensorDropdownState = (
    selectedFieldIds: number[],
    campaignTables: Map<number, CampaignTable>,
    tableFields: CampaignTableField[],
    setSelectedFieldIds: (fieldIds: number[]) => void,
    isMultipleSelection: boolean,
) => {
    const [selectedSensor, setSelectedSensor] = useState(-1);

    const selectedFields = useMemo(() => tableFields.filter(field => selectedFieldIds.includes(field.id)), [selectedFieldIds, tableFields]);

    const dropdownLabel = useMemo(() => {
        if (selectedFieldIds.length == 0) {
            return "Select Sensor";
        }

        const displayedField = tableFields.find(field => field.id == selectedFieldIds[0]);

        if (displayedField == undefined) {
            return "Select Sensor";
        }

        const tableName = campaignTables.get(displayedField?.campaign_table_id)?.name;

        if (selectedFieldIds.length == 1) {
            return `${tableName} - ${displayedField?.name}`;
        } else {
            return `${tableName} - ${displayedField?.name} + ${selectedFieldIds.length - 1} more`;
        }
    }, [selectedFieldIds, tableFields, campaignTables]);

    const isAllSelected = useMemo(() => {
        return new Map<number, boolean>(
            Array.from(campaignTables.values()).map((table) => {
                const allSelected = tableFields
                    .filter(field => field.campaign_table_id === table.id)
                    .every(field => selectedFieldIds.includes(field.id));
                return [table.id, allSelected];
            })
        );
    }, [selectedFieldIds, tableFields, campaignTables]);

    const selectedCountByTable = useMemo(() => {
        const counts = new Map<number, number>();
        tableFields.forEach(field => {
            if (selectedFieldIds.includes(field.id)) {
                counts.set(field.campaign_table_id, (counts.get(field.campaign_table_id) || 0) + 1);
            }
        });
        return counts;
    }, [tableFields, selectedFieldIds]);

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
        const fieldIds = tableFields.filter(field => field.campaign_table_id === campaignTableId).map(field => field.id);
        if (isAllSelected.get(campaignTableId) ?? false) {
            setSelectedFieldIds(selectedFieldIds.filter(id => !fieldIds.includes(id)));
        } else {
            setSelectedFieldIds([...selectedFieldIds, ...fieldIds]);
        }
    }, [selectedFieldIds, isAllSelected, setSelectedFieldIds, tableFields]);

    return {
        selectedFields,
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllSelected,
        toggleFieldSelection,
        toggleAllFieldsSelection,
        selectedCountByTable,
    };
};

export default useSensorDropdownState;
