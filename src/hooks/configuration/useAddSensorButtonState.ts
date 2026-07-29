import { useState, useMemo, useCallback } from "react";

import { useTemplateTable } from "@/hooks/configuration/useTemplateTable";
import { CampaignTable } from "@/types/campaign";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";

export default function useAddSensorButtonState() {
    const { tables, addTable } = useCampaignConfigEdit((state) => state);
    const { availableTemplateTables } = useTemplateTable(tables);

    const [isSensorInputVisible, setIsSensorInputVisible] = useState(false);
    const [sensorName, setSensorName] = useState("");
    const [sensorDescription, setSensorDescription] = useState("");
    const [sensorNameQuery, setSensorNameQuery] = useState("");

    const queryResultTables = useMemo(() => {
        return availableTemplateTables
            .filter((table) => table.display_name.toLowerCase().includes(sensorNameQuery.toLowerCase()))
    }, [availableTemplateTables, sensorNameQuery]);

    const setCustomSensorInputVisibility = useCallback((visibility: boolean) => {
        setIsSensorInputVisible(visibility);
        setSensorName("");
        setSensorDescription("");
    }, []);

    const addSensor = useCallback((table: CampaignTable) => {
        addTable(table);
    }, [addTable]);

    const addCustomSensorAsIs = useCallback(() => {
        addTable({
            campaign_id: -1,
            name: sensorName,
            display_name: sensorName,
            description: sensorDescription,
            daily_count_max: 0,
            campaign_table_field: [],
            is_custom: true
        });
    }, [addTable, sensorName, sensorDescription]);

    return { queryResultTables, isSensorInputVisible, sensorName, setSensorName, sensorDescription, setSensorDescription, sensorNameQuery, setSensorNameQuery, setCustomSensorInputVisibility, addCustomSensorAsIs, addSensor };
}