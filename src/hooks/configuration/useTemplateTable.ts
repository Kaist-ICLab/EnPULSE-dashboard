import { useMemo } from "react";
import { CampaignTable, CampaignTableField } from "@/types/campaign";

type TemplateCampaignTable = Omit<CampaignTable, 'id' | 'campaign_id' | 'daily_count_max' | 'is_custom' | 'campaign_table_field'> & {
    campaign_table_field: Omit<CampaignTableField, 'id' | 'campaign_table_id' | 'campaign_table_field_mapping'>[];
}

const accelerometerSensor: TemplateCampaignTable = {
    name: "accelerometer_sensor",
    display_name: "Accelerometer",
    description: "Accelerometer sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "x", field_role: "data", field_type: "numerical" },
        { name: "y", field_role: "data", field_type: "numerical" },
        { name: "z", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const ambientLightSensor: TemplateCampaignTable = {
    name: "ambient_light_sensor",
    display_name: "Ambient Light",
    description: "Ambient light sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "value", field_role: "data", field_type: "numerical" },
        { name: "accuracy", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const appListChangeSensor: TemplateCampaignTable = {
    name: "app_list_change_sensor",
    display_name: "App List Change",
    description: "App list change sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "changed_app", field_role: "data", field_type: "categorical" },
        { name: "app_list", field_role: "ignore", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const appUsageLogSensor: TemplateCampaignTable = {
    name: "app_usage_log_sensor",
    display_name: "App Usage Log",
    description: "App usage log sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "installed_by", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const batterySensor: TemplateCampaignTable = {
    name: "battery_sensor",
    display_name: "Battery",
    description: "Battery sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "level", field_role: "data", field_type: "numerical" },
        { name: "connected_type", field_role: "data", field_type: "categorical" },
        { name: "status", field_role: "data", field_type: "numerical" },
        { name: "temperature", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const bluetoothScanSensor: TemplateCampaignTable = {
    name: "bluetooth_scan_sensor",
    display_name: "Bluetooth Scan",
    description: "Bluetooth scan sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "address", field_role: "data", field_type: "categorical" },
        { name: "name", field_role: "data", field_type: "categorical" },
        { name: "alias", field_role: "data", field_type: "categorical" },
        { name: "bond_state", field_role: "data", field_type: "numerical" },
        { name: "class_type", field_role: "data", field_type: "numerical" },
        { name: "connection_type", field_role: "data", field_type: "numerical" },
        { name: "is_le", field_role: "data", field_type: "categorical" },
        { name: "rssi", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const callLogSensor: TemplateCampaignTable = {
    name: "call_log_sensor",
    display_name: "Call Log",
    description: "Call log sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "number", field_role: "data", field_type: "categorical" },
        { name: "call_type", field_role: "data", field_type: "numerical" },
        { name: "duration", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const connectivitySensor: TemplateCampaignTable = {
    name: "connectivity_sensor",
    display_name: "Connectivity",
    description: "Connectivity sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "is_connected", field_role: "data", field_type: "categorical" },
        { name: "has_internet", field_role: "data", field_type: "categorical" },
        { name: "network_type", field_role: "data", field_type: "categorical" },
        { name: "transport_types", field_role: "ignore", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const dataTrafficSensor: TemplateCampaignTable = {
    name: "data_traffic_sensor",
    display_name: "Data Traffic",
    description: "Data traffic sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "total_rx", field_role: "data", field_type: "numerical" },
        { name: "total_tx", field_role: "data", field_type: "numerical" },
        { name: "mobile_rx", field_role: "data", field_type: "numerical" },
        { name: "mobile_tx", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const deviceModeSensor: TemplateCampaignTable = {
    name: "device_mode_sensor",
    display_name: "Device Mode",
    description: "Device mode sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "event_type", field_role: "data", field_type: "categorical" },
        { name: "value", field_role: "data", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const edaSensor: TemplateCampaignTable = {
    name: "eda_sensor",
    display_name: "Electrodermal Activity",
    description: "Electrodermal activity sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "skin_conductance", field_role: "data", field_type: "numerical" },
        { name: "status", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const heartRateSensor: TemplateCampaignTable = {
    name: "heart_rate_sensor",
    display_name: "Heart Rate",
    description: "Heart rate sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "hr", field_role: "data", field_type: "numerical" },
        { name: "hr_status", field_role: "data", field_type: "numerical" },
        { name: "ibi", field_role: "ignore", field_type: "categorical" },
        { name: "ibi_status", field_role: "ignore", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const locationSensor: TemplateCampaignTable = {
    name: "location_sensor",
    display_name: "Location",
    description: "Location sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "latitude", field_role: "data", field_type: "numerical" },
        { name: "longitude", field_role: "data", field_type: "numerical" },
        { name: "altitude", field_role: "data", field_type: "numerical" },
        { name: "accuracy", field_role: "data", field_type: "numerical" },
        { name: "speed", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const mediaSensor: TemplateCampaignTable = {
    name: "media_sensor",
    display_name: "Media",
    description: "Media sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "uri", field_role: "data", field_type: "categorical" },
        { name: "media_type", field_role: "data", field_type: "categorical" },
        { name: "operation", field_role: "data", field_type: "categorical" },
        { name: "storage_type", field_role: "data", field_type: "categorical" },
        { name: "file_name", field_role: "data", field_type: "categorical" },
        { name: "mime_type", field_role: "data", field_type: "categorical" },
        { name: "date_added", field_role: "data", field_type: "datetime" },
        { name: "date_modified", field_role: "data", field_type: "datetime" },
        { name: "size", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const messageLogSensor: TemplateCampaignTable = {
    name: "message_log_sensor",
    display_name: "Message Log",
    description: "Message log sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "number", field_role: "data", field_type: "categorical" },
        { name: "message_type", field_role: "data", field_type: "categorical" },
        { name: "contact_type", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const notificationSensor: TemplateCampaignTable = {
    name: "notification_sensor",
    display_name: "Notification",
    description: "Notification sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "title", field_role: "data", field_type: "categorical" },
        { name: "text", field_role: "data", field_type: "categorical" },
        { name: "category", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "categorical" },
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "visibility", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const ppgSensor: TemplateCampaignTable = {
    name: "ppg_sensor",
    display_name: "PPG",
    description: "PPG sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "red", field_role: "data", field_type: "numerical" },
        { name: "red_status", field_role: "data", field_type: "categorical" },
        { name: "green", field_role: "data", field_type: "numerical" },
        { name: "green_status", field_role: "data", field_type: "categorical" },
        { name: "ir", field_role: "data", field_type: "numerical" },
        { name: "ir_status", field_role: "data", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const screenSensor: TemplateCampaignTable = {
    name: "screen_sensor",
    display_name: "Screen",
    description: "Screen sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "type", field_role: "data", field_type: "categorical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const skinTemperatureSensor: TemplateCampaignTable = {
    name: "skin_temperature_sensor",
    display_name: "Skin Temperature",
    description: "Skin temperature sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "ambient_temperature", field_role: "data", field_type: "numerical" },
        { name: "object_temperature", field_role: "data", field_type: "numerical" },
        { name: "status", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const stepSensor: TemplateCampaignTable = {
    name: "step_sensor",
    display_name: "Step",
    description: "Step sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "steps", field_role: "data", field_type: "numerical" },
        { name: "start_time", field_role: "data", field_type: "datetime" },
        { name: "end_time", field_role: "data", field_type: "datetime" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const userInteractionSensor: TemplateCampaignTable = {
    name: "user_interaction_sensor",
    display_name: "User Interaction",
    description: "User interaction sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "class_name", field_role: "data", field_type: "categorical" },
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "text", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
};

const wifiScanSensor: TemplateCampaignTable = {
    name: "wifi_scan_sensor",
    display_name: "WiFi Scan",
    description: "WiFi scan sensor",
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime" },
        { name: "bssid", field_role: "data", field_type: "categorical" },
        { name: "ssid", field_role: "data", field_type: "categorical" },
        { name: "frequency", field_role: "data", field_type: "numerical" },
        { name: "level", field_role: "data", field_type: "numerical" },
        { name: "device_type", field_role: "ignore", field_type: "categorical" },
        { name: "received", field_role: "ignore", field_type: "datetime" },
    ],
}

export function useTemplateTable(selectedTables: CampaignTable[]) {
    const selectedTemplateTables = useMemo(() => selectedTables.filter(t => !t.is_custom), [selectedTables]);

    const availableTemplateTables = useMemo<CampaignTable[]>(() => {
        const templateTable: TemplateCampaignTable[] = [
            accelerometerSensor,
            ambientLightSensor,
            appListChangeSensor,
            appUsageLogSensor,
            batterySensor,
            bluetoothScanSensor,
            callLogSensor,
            connectivitySensor,
            dataTrafficSensor,
            deviceModeSensor,
            edaSensor,
            heartRateSensor,
            locationSensor,
            mediaSensor,
            messageLogSensor,
            notificationSensor,
            ppgSensor,
            screenSensor,
            skinTemperatureSensor,
            stepSensor,
            userInteractionSensor,
            wifiScanSensor,
        ]

        return templateTable
            .filter((table) => !selectedTemplateTables.some((selectedTable) => selectedTable.name === table.name))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((table) => ({
                ...table,
                id: -1,
                campaign_id: -1,
                daily_count_max: 0,
                is_custom: false,
                campaign_table_field: table.campaign_table_field.map((field) => ({
                    ...field,
                    id: -1,
                    campaign_table_id: -1,
                    campaign_table_field_mapping: [],
                })),
            }))
    }, [selectedTemplateTables]);

    return { availableTemplateTables };
}
