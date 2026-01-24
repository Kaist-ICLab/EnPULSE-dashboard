import { CampaignTable } from "@/types/campaign";

const accelerometerSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "accelerometer_sensor",
    description: "Accelerometer sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "x", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "y", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "z", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const ambientLightSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "ambient_light_sensor",
    description: "Ambient light sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "value", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "accuracy", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 4, campaign_table_id: -1 },
    ],
};

const appListChangeSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "app_list_change_sensor",
    description: "App list change sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "changed_app", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "app_list", field_role: "ignore", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 4, campaign_table_id: -1 },
    ],
};

const appUsageLogSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "app_usage_log_sensor",
    description: "App usage log sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "package_name", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "installed_by", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "event_type", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const batterySensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "battery_sensor",
    description: "Battery sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "level", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "connected_type", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "status", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "temperature", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

const bluetoothScanSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "bluetooth_scan_sensor",
    description: "Bluetooth scan sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "address", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "name", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "alias", field_role: "data", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "bond_state", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "class_type", field_role: "data", field_type: "numerical", id: 5, campaign_table_id: -1 },
        { name: "connection_type", field_role: "data", field_type: "numerical", id: 6, campaign_table_id: -1 },
        { name: "is_le", field_role: "data", field_type: "categorical", id: 7, campaign_table_id: -1 },
        { name: "rssi", field_role: "data", field_type: "numerical", id: 8, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 9, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 10, campaign_table_id: -1 },
    ],
};

const callLogSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "call_log_sensor",
    description: "Call log sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "number", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "call_type", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "duration", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const connectivitySensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "connectivity_sensor",
    description: "Connectivity sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "is_connected", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "has_internet", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "network_type", field_role: "data", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "transport_types", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

const dataTrafficSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "data_traffic_sensor",
    description: "Data traffic sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "total_rx", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "total_tx", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "mobile_rx", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "mobile_tx", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

const deviceModeSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "device_mode_sensor",
    description: "Device mode sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "event_type", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "value", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 4, campaign_table_id: -1 },
    ],
};

const edaSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "eda_sensor",
    description: "Electrodermal activity sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "skin_conductance", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "status", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 4, campaign_table_id: -1 },
    ],
};

const heartRateSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "heart_rate_sensor",
    description: "Heart rate sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "hr", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "hr_status", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "ibi", field_role: "ignore", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "ibi_status", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

const locationSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "location_sensor",
    description: "Location sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "latitude", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "longitude", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "altitude", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "accuracy", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "speed", field_role: "data", field_type: "numerical", id: 5, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 6, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 7, campaign_table_id: -1 },
    ],
};

const mediaSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "media_sensor",
    description: "Media sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "uri", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "media_type", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "operation", field_role: "data", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "storage_type", field_role: "data", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "file_name", field_role: "data", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "mime_type", field_role: "data", field_type: "categorical", id: 6, campaign_table_id: -1 },
        { name: "date_added", field_role: "data", field_type: "datetime", id: 7, campaign_table_id: -1 },
        { name: "date_modified", field_role: "data", field_type: "datetime", id: 8, campaign_table_id: -1 },
        { name: "size", field_role: "data", field_type: "numerical", id: 9, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 10, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 11, campaign_table_id: -1 },
    ],
};

const messageLogSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "message_log_sensor",
    description: "Message log sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "number", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "message_type", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "contact_type", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const notificationSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "notification_sensor",
    description: "Notification sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "title", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "text", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "category", field_role: "data", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "event_type", field_role: "data", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "package_name", field_role: "data", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "visibility", field_role: "data", field_type: "numerical", id: 6, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 7, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 8, campaign_table_id: -1 },
    ],
};

const ppgSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "ppg_sensor",
    description: "PPG sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "red", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "red_status", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "green", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "green_status", field_role: "data", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "ir", field_role: "data", field_type: "numerical", id: 5, campaign_table_id: -1 },
        { name: "ir_status", field_role: "data", field_type: "categorical", id: 6, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 7, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 8, campaign_table_id: -1 },
    ],
};

const screenSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "screen_sensor",
    description: "Screen sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "type", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 3, campaign_table_id: -1 },
    ],
};

const skinTemperatureSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "skin_temperature_sensor",
    description: "Skin temperature sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "ambient_temperature", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "object_temperature", field_role: "data", field_type: "numerical", id: 2, campaign_table_id: -1 },
        { name: "status", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const stepSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "step_sensor",
    description: "Step sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "steps", field_role: "data", field_type: "numerical", id: 1, campaign_table_id: -1 },
        { name: "start_time", field_role: "data", field_type: "datetime", id: 2, campaign_table_id: -1 },
        { name: "end_time", field_role: "data", field_type: "datetime", id: 3, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 4, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 5, campaign_table_id: -1 },
    ],
};

const userInteractionSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "user_interaction_sensor",
    description: "User interaction sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "class_name", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "package_name", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "text", field_role: "data", field_type: "categorical", id: 3, campaign_table_id: -1 },
        { name: "event_type", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

const wifiScanSensor: CampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "wifi_scan_sensor",
    description: "WiFi scan sensor",
    daily_count_max: 0,
    is_custom: false,
    campaign_table_field: [
        { name: "timestamp", field_role: "timestamp", field_type: "datetime", id: 0, campaign_table_id: -1 },
        { name: "bssid", field_role: "data", field_type: "categorical", id: 1, campaign_table_id: -1 },
        { name: "ssid", field_role: "data", field_type: "categorical", id: 2, campaign_table_id: -1 },
        { name: "frequency", field_role: "data", field_type: "numerical", id: 3, campaign_table_id: -1 },
        { name: "level", field_role: "data", field_type: "numerical", id: 4, campaign_table_id: -1 },
        { name: "device_type", field_role: "ignore", field_type: "categorical", id: 5, campaign_table_id: -1 },
        { name: "received", field_role: "ignore", field_type: "datetime", id: 6, campaign_table_id: -1 },
    ],
};

export const templateTable: CampaignTable[] = [
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
].sort((a, b) => a.name.localeCompare(b.name));

