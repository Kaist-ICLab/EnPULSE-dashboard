import { useMemo, useState, useCallback } from "react";
import { CampaignTable, CampaignTableField } from "@/types/campaign";

const useSensorDropdownState = (
    selectedFieldIds: number[],
    campaignTables: Map<number, CampaignTable>,
    campaignTableFields: Map<number, CampaignTableField>,
    setSelectedFieldIds: (fieldIds: number[]) => void,
    isMultipleSelection: boolean,
) => {
    const [selectedSensor, setSelectedSensor] = useState(-1);
    const selectedFields = useMemo(() => selectedFieldIds.map(id => campaignTableFields.get(id)).filter(field => field != undefined), [selectedFieldIds, campaignTableFields]);

    const dropdownLabel = useMemo(() => {
        if (selectedFieldIds.length == 0) {
            return "Select Sensor";
        }

        const displayedField = campaignTableFields.get(selectedFieldIds[0])
        if (displayedField == undefined) {
            return "Select Sensor";
        }

        const tableName = campaignTables.get(displayedField?.campaign_table_id)?.name;

        if (selectedFieldIds.length == 1) {
            return `${tableName} - ${displayedField?.name}`;
        } else {
            return `${tableName} - ${displayedField?.name} + ${selectedFieldIds.length - 1} more`;
        }
    }, [selectedFieldIds, campaignTableFields, campaignTables]);

    const isAllSelected = useMemo(() => {
        return new Map<number, boolean>(
            Array.from(campaignTables.values()).map((table) => {
                const allSelected = table.campaign_table_field.every(field => selectedFieldIds.includes(field.id));
                return [table.id, allSelected];
            })
        );
    }, [selectedFieldIds, campaignTables]);

    const selectedCountByTable = useMemo(() => {
        return new Map<number, number>(
            Array.from(campaignTables.values()).map((table) => {
                const selectedCount = table.campaign_table_field.filter(field => selectedFieldIds.includes(field.id)).length;
                return [table.id, selectedCount];
            })
        );
    }, [selectedFieldIds, campaignTables]);

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
        const fieldIds = campaignTables.get(campaignTableId)?.campaign_table_field.map(field => field.id) ?? [];

        if (isAllSelected.get(campaignTableId) ?? false) {
            setSelectedFieldIds(selectedFieldIds.filter(id => !fieldIds.includes(id)));
        } else {
            setSelectedFieldIds([...selectedFieldIds, ...fieldIds]);
        }
    }, [selectedFieldIds, isAllSelected, setSelectedFieldIds, campaignTables]);

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
