import { useState, useMemo, useCallback } from "react";

import { useTemplateTable } from "@/hooks/configuration/useTemplateTable";
import { CampaignTable } from "@/types/campaign";
import { TIMING_SENSOR_TABLE_NAME } from "@/types/timingSchedule";
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

    // The client looks up the timing_sensor row by exact `name` — a custom sensor typed with
    // that same name would collide with (or silently shadow) it, so block the add rather than
    // let it through.
    const isCustomSensorNameReserved = useMemo(
        () => sensorName.trim().toLowerCase() === TIMING_SENSOR_TABLE_NAME,
        [sensorName]
    );

    const addCustomSensorAsIs = useCallback(() => {
        if (isCustomSensorNameReserved) return;
        addTable({
            campaign_id: -1,
            name: sensorName,
            display_name: sensorName,
            description: sensorDescription,
            daily_count_max: 0,
            campaign_table_field: [],
            is_custom: true
        });
    }, [addTable, sensorName, sensorDescription, isCustomSensorNameReserved]);

    return {
        queryResultTables, isSensorInputVisible, sensorName, setSensorName, sensorDescription, setSensorDescription,
        sensorNameQuery, setSensorNameQuery, setCustomSensorInputVisibility, addCustomSensorAsIs, addSensor,
        isCustomSensorNameReserved,
    };
}