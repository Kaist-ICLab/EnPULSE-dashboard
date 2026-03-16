import { useMemo, useState, useCallback } from "react";
import { CampaignTable, CampaignTableField } from "@/types/campaign";
import { DeepRequired } from "@/utils/type";

const useSensorDropdownState = (
    selectedFieldIds: number[],
    campaignTables: Map<number, DeepRequired<CampaignTable>>,
    campaignTableFields: Map<number, DeepRequired<CampaignTableField>>,
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

        const displayName = campaignTables.get(displayedField?.campaign_table_id)?.display_name;

        if (selectedFieldIds.length == 1) {
            return `${displayName} - ${displayedField?.name}`;
        } else {
            return `${displayName} - ${displayedField?.name} + ${selectedFieldIds.length - 1} more`;
        }
    }, [selectedFieldIds, campaignTableFields, campaignTables]);

    const isAllFieldsSelected = useMemo(() => {
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

        if (isAllFieldsSelected.get(campaignTableId) ?? false) {
            setSelectedFieldIds(selectedFieldIds.filter(id => !fieldIds.includes(id)));
        } else {
            setSelectedFieldIds([...selectedFieldIds, ...fieldIds]);
        }
    }, [selectedFieldIds, isAllFieldsSelected, setSelectedFieldIds, campaignTables]);

    const isAllSensorsSelected = useMemo(() => {
        return selectedFields.length === campaignTableFields.size;
    }, [selectedFields, campaignTableFields]);


    const toggleAllSensorsSelection = useCallback(() => {
        if (isAllSensorsSelected) {
            setSelectedFieldIds([]);
        } else {
            setSelectedFieldIds(Array.from(campaignTableFields.keys()));
        }
    }, [isAllSensorsSelected, setSelectedFieldIds, campaignTableFields]);

    return {
        selectedFields,
        selectedSensor,
        setSelectedSensor,
        dropdownLabel,
        isAllFieldsSelected,
        isAllSensorsSelected,
        toggleFieldSelection,
        toggleAllFieldsSelection,
        toggleAllSensorsSelection,
        selectedCountByTable,
    };
};

export default useSensorDropdownState;
