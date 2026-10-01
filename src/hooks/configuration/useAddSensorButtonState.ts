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
    return availableTemplateTables.filter((table) =>
      table.display_name.toLowerCase().includes(sensorNameQuery.toLowerCase()),
    );
  }, [availableTemplateTables, sensorNameQuery]);

  const setCustomSensorInputVisibility = useCallback((visibility: boolean) => {
    setIsSensorInputVisible(visibility);
    setSensorName("");
    setSensorDescription("");
  }, []);

  const addSensor = useCallback(
    (table: CampaignTable) => {
      addTable(table);
    },
    [addTable],
  );

  // campaign_table is unique on (campaign_id, name), so an empty or repeated name fails
  // only at save time with a cryptic "duplicate key" error. Template names are blocked
  // too: adding that template later would collide. The client also looks up the
  // timing_sensor row by exact `name`, so that name is reserved.
  const customSensorNameError = useMemo(() => {
    const name = sensorName.trim().toLowerCase();
    if (name.length === 0) return "Enter a sensor name.";
    if (name === TIMING_SENSOR_TABLE_NAME) {
      return `"${TIMING_SENSOR_TABLE_NAME}" is a reserved name (used by the Timing Schedules feature). Choose another.`;
    }
    if (tables.some((t) => t.name.trim().toLowerCase() === name)) {
      return "This campaign already has a sensor with this name.";
    }
    if (availableTemplateTables.some((t) => t.name.toLowerCase() === name)) {
      return "This name is used by a template sensor. Add it from the template list or choose another name.";
    }
    return null;
  }, [sensorName, tables, availableTemplateTables]);

  const addCustomSensorAsIs = useCallback(() => {
    if (customSensorNameError) return;
    const name = sensorName.trim();
    addTable({
      campaign_id: -1,
      name,
      display_name: name,
      description: sensorDescription,
      daily_count_max: 0,
      campaign_table_field: [],
      is_custom: true,
    });
  }, [addTable, sensorName, sensorDescription, customSensorNameError]);

  return {
    queryResultTables,
    isSensorInputVisible,
    sensorName,
    setSensorName,
    sensorDescription,
    setSensorDescription,
    sensorNameQuery,
    setSensorNameQuery,
    setCustomSensorInputVisibility,
    addCustomSensorAsIs,
    addSensor,
    customSensorNameError,
  };
}
