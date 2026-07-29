import { useMemo } from "react";
import { CampaignTable, CampaignTableField } from "@/types/campaign";

type TemplateCampaignTable = Omit<CampaignTable, 'id' | 'campaign_id' | 'daily_count_max' | 'is_custom' | 'campaign_table_field'> & {
    campaign_table_field: (Omit<CampaignTableField, 'id' | 'campaign_table_id' | 'campaign_table_field_mapping'> & {
        campaign_table_field_mapping?: { display: string; value: string }[]
    }
    )[];
}

/**
 * Default columns: uuid, device_type, timestamp, event_id, received, created_at
 * TODO: duration type sensors
 */

const accelerometerSensor: TemplateCampaignTable = {
    name: "accelerometer_sensor",
    display_name: "Accelerometer",
    description: "Accelerometer sensor",
    campaign_table_field: [
        { name: "x", field_role: "data", field_type: "numerical" },
        { name: "y", field_role: "data", field_type: "numerical" },
        { name: "z", field_role: "data", field_type: "numerical" },
    ],
};

const ambientLightSensor: TemplateCampaignTable = {
    name: "ambient_light_sensor",
    display_name: "Ambient Light",
    description: "Ambient light sensor",
    campaign_table_field: [
        { name: "value", field_role: "data", field_type: "numerical" },
        { name: "accuracy", field_role: "data", field_type: "numerical" },
    ],
};

const appListChangeSensor: TemplateCampaignTable = {
    name: "app_list_change_sensor",
    display_name: "App List Change",
    description: "App list change sensor",
    campaign_table_field: [
        { name: "changed_app", field_role: "data", field_type: "categorical" },
        { name: "app_list", field_role: "ignore", field_type: "categorical" },
    ],
};

const appUsageLogSensor: TemplateCampaignTable = {
    name: "app_usage_log_sensor",
    display_name: "App Usage Log",
    description: "App usage log sensor",
    campaign_table_field: [
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "installed_by", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "numerical" },
    ],
};

const activityRecognitionSensor: TemplateCampaignTable = {
    name: "activity_recognition_sensor",
    display_name: "Activity Recognition",
    description: "Activity recognition sensor",
    campaign_table_field: [
        { name: "elapsed_realtime_millis", field_role: "data", field_type: "numerical" },
        {
            name: "activity_type", field_role: "data", field_type: "categorical",
            campaign_table_field_mapping: [
                { display: "In Vehicle", value: "0" },
                { display: "On Bicycle", value: "1" },
                { display: "On Foot", value: "2" },
                { display: "Still", value: "3" },
                { display: "Unknown", value: "4" },
                { display: "Tilting", value: "5" },
                { display: "Walking", value: "6" },
                { display: "Running", value: "8" },
            ]
        },
        { name: "score", field_role: "data", field_type: "numerical" },
        { name: "probabilities", field_role: "ignore", field_type: "categorical" },
    ],
};

const batterySensor: TemplateCampaignTable = {
    name: "battery_sensor",
    display_name: "Battery",
    description: "Battery sensor",
    campaign_table_field: [
        { name: "level", field_role: "data", field_type: "numerical" },
        { name: "connected_type", field_role: "data", field_type: "categorical" },
        { name: "status", field_role: "data", field_type: "numerical" },
        { name: "temperature", field_role: "data", field_type: "numerical" },
    ],
};

const bluetoothScanSensor: TemplateCampaignTable = {
    name: "bluetooth_scan_sensor",
    display_name: "Bluetooth Scan",
    description: "Bluetooth scan sensor",
    campaign_table_field: [
        { name: "address", field_role: "data", field_type: "categorical" },
        { name: "name", field_role: "data", field_type: "categorical" },
        { name: "alias", field_role: "data", field_type: "categorical" },
        { name: "bond_state", field_role: "data", field_type: "numerical" },
        { name: "class_type", field_role: "data", field_type: "numerical" },
        { name: "connection_type", field_role: "data", field_type: "numerical" },
        { name: "is_le", field_role: "data", field_type: "categorical" },
        { name: "rssi", field_role: "data", field_type: "numerical" },
    ],
};

const callLogSensor: TemplateCampaignTable = {
    name: "call_log_sensor",
    display_name: "Call Log",
    description: "Call log sensor",
    campaign_table_field: [
        { name: "number", field_role: "data", field_type: "categorical" },
        { name: "call_type", field_role: "data", field_type: "numerical" },
        { name: "duration", field_role: "data", field_type: "numerical" },
    ],
};

const connectivitySensor: TemplateCampaignTable = {
    name: "connectivity_sensor",
    display_name: "Connectivity",
    description: "Connectivity sensor",
    campaign_table_field: [
        { name: "is_connected", field_role: "data", field_type: "categorical" },
        { name: "has_internet", field_role: "data", field_type: "categorical" },
        { name: "network_type", field_role: "data", field_type: "categorical" },
        { name: "transport_types", field_role: "ignore", field_type: "categorical" },
    ],
};

const dataTrafficSensor: TemplateCampaignTable = {
    name: "data_traffic_sensor",
    display_name: "Data Traffic",
    description: "Data traffic sensor",
    campaign_table_field: [
        { name: "total_rx", field_role: "data", field_type: "numerical" },
        { name: "total_tx", field_role: "data", field_type: "numerical" },
        { name: "mobile_rx", field_role: "data", field_type: "numerical" },
        { name: "mobile_tx", field_role: "data", field_type: "numerical" },
    ],
};

const deviceModeSensor: TemplateCampaignTable = {
    name: "device_mode_sensor",
    display_name: "Device Mode",
    description: "Device mode sensor",
    campaign_table_field: [
        { name: "event_type", field_role: "data", field_type: "categorical" },
        { name: "value", field_role: "data", field_type: "categorical" },
    ],
};

const edaSensor: TemplateCampaignTable = {
    name: "eda_sensor",
    display_name: "Electrodermal Activity",
    description: "Electrodermal activity sensor",
    campaign_table_field: [
        { name: "skin_conductance", field_role: "data", field_type: "numerical" },
        { name: "status", field_role: "data", field_type: "numerical" },
    ],
};

const gestureSensor: TemplateCampaignTable = {
    name: "gesture_sensor",
    display_name: "Gesture",
    description: "Gesture sensor",
    campaign_table_field: [
        {
            name: "class_index", field_role: "data", field_type: "categorical", campaign_table_field_mapping: [
                { display: "Alarm Clock", value: "0" },
                { display: "Blender In Use", value: "1" },
                { display: "Brushing Hair", value: "2" },
                { display: "Chopping", value: "3" },
                { display: "Clapping", value: "4" },
                { display: "Coughing", value: "5" },
                { display: "Drill In Use", value: "6" },
                { display: "Drinking", value: "7" },
                { display: "Grating", value: "8" },
                { display: "Hair Dryer In Use", value: "9" },
                { display: "Hammering", value: "10" },
                { display: "Knocking", value: "11" },
                { display: "Laughing", value: "12" },
                { display: "Microwave", value: "13" },
                { display: "Pouring Pitcher", value: "14" },
                { display: "Sanding", value: "15" },
                { display: "Scratching", value: "16" },
                { display: "Screwing", value: "17" },
                { display: "Shaver In Use", value: "18" },
                { display: "Toilet Flushing", value: "19" },
                { display: "Toothbrushing", value: "20" },
                { display: "Twisting Jar", value: "21" },
                { display: "Vacuum In Use", value: "22" },
                { display: "Washing Utensils", value: "23" },
                { display: "Washing Hands", value: "24" },
                { display: "Wiping With Rag", value: "25" },
                { display: "Other", value: "26" },
            ]
        },
        { name: "score", field_role: "data", field_type: "numerical" },
        { name: "probabilities", field_role: "ignore", field_type: "categorical" },
    ],
};

const heartRateSensor: TemplateCampaignTable = {
    name: "heart_rate_sensor",
    display_name: "Heart Rate",
    description: "Heart rate sensor",
    campaign_table_field: [
        { name: "hr", field_role: "data", field_type: "numerical" },
        { name: "hr_status", field_role: "data", field_type: "numerical" },
        { name: "ibi", field_role: "ignore", field_type: "categorical" },
        { name: "ibi_status", field_role: "ignore", field_type: "categorical" },
    ],
};

const imuSensor: TemplateCampaignTable = {
    name: "imu_sensor",
    display_name: "IMU",
    description: "IMU sensor",
    campaign_table_field: [
        { name: "acc_x", field_role: "data", field_type: "numerical" },
        { name: "acc_y", field_role: "data", field_type: "numerical" },
        { name: "acc_z", field_role: "data", field_type: "numerical" },
        { name: "gyro_x", field_role: "data", field_type: "numerical" },
        { name: "gyro_y", field_role: "data", field_type: "numerical" },
        { name: "gyro_z", field_role: "data", field_type: "numerical" },
    ],
};

const locationSensor: TemplateCampaignTable = {
    name: "location_sensor",
    display_name: "Location",
    description: "Location sensor",
    campaign_table_field: [
        { name: "latitude", field_role: "data", field_type: "numerical" },
        { name: "longitude", field_role: "data", field_type: "numerical" },
        { name: "altitude", field_role: "data", field_type: "numerical" },
        { name: "accuracy", field_role: "data", field_type: "numerical" },
        { name: "speed", field_role: "data", field_type: "numerical" },
    ],
};

const mediaSensor: TemplateCampaignTable = {
    name: "media_sensor",
    display_name: "Media",
    description: "Media sensor",
    campaign_table_field: [
        { name: "uri", field_role: "data", field_type: "categorical" },
        { name: "media_type", field_role: "data", field_type: "categorical" },
        { name: "operation", field_role: "data", field_type: "categorical" },
        { name: "storage_type", field_role: "data", field_type: "categorical" },
        { name: "file_name", field_role: "data", field_type: "categorical" },
        { name: "mime_type", field_role: "data", field_type: "categorical" },
        { name: "date_added", field_role: "data", field_type: "datetime" },
        { name: "date_modified", field_role: "data", field_type: "datetime" },
        { name: "size", field_role: "data", field_type: "numerical" },
    ],
};

const messageLogSensor: TemplateCampaignTable = {
    name: "message_log_sensor",
    display_name: "Message Log",
    description: "Message log sensor",
    campaign_table_field: [
        { name: "number", field_role: "data", field_type: "categorical" },
        { name: "message_type", field_role: "data", field_type: "categorical" },
        { name: "contact_type", field_role: "data", field_type: "numerical" },
    ],
};

const notificationSensor: TemplateCampaignTable = {
    name: "notification_sensor",
    display_name: "Notification",
    description: "Notification sensor",
    campaign_table_field: [
        { name: "title", field_role: "data", field_type: "categorical" },
        { name: "text", field_role: "data", field_type: "categorical" },
        { name: "category", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "categorical" },
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "visibility", field_role: "data", field_type: "numerical" },
    ],
};

const ppgSensor: TemplateCampaignTable = {
    name: "ppg_sensor",
    display_name: "PPG",
    description: "PPG sensor",
    campaign_table_field: [
        { name: "red", field_role: "data", field_type: "numerical" },
        { name: "red_status", field_role: "data", field_type: "categorical" },
        { name: "green", field_role: "data", field_type: "numerical" },
        { name: "green_status", field_role: "data", field_type: "categorical" },
        { name: "ir", field_role: "data", field_type: "numerical" },
        { name: "ir_status", field_role: "data", field_type: "categorical" },
    ],
};

const screenSensor: TemplateCampaignTable = {
    name: "screen_sensor",
    display_name: "Screen",
    description: "Screen sensor",
    campaign_table_field: [
        { name: "type", field_role: "data", field_type: "categorical" },
    ],
};

const skinTemperatureSensor: TemplateCampaignTable = {
    name: "skin_temperature_sensor",
    display_name: "Skin Temperature",
    description: "Skin temperature sensor",
    campaign_table_field: [
        { name: "ambient_temperature", field_role: "data", field_type: "numerical" },
        { name: "object_temperature", field_role: "data", field_type: "numerical" },
        { name: "status", field_role: "data", field_type: "numerical" },
    ],
};

const stressSensor: TemplateCampaignTable = {
    name: "stress_sensor",
    display_name: "Stress",
    description: "Stress sensor",
    campaign_table_field: [
        { name: "window_start_ms", field_role: "ignore", field_type: "datetime" },
        { name: "probability", field_role: "data", field_type: "numerical" },
        { name: "is_high_stress", field_role: "data", field_type: "categorical" },
    ],
};

const stepSensor: TemplateCampaignTable = {
    name: "step_sensor",
    display_name: "Step",
    description: "Step sensor",
    campaign_table_field: [
        { name: "steps", field_role: "data", field_type: "numerical" },
        { name: "duration", field_role: "data", field_type: "numerical" },
    ],
};

const userInteractionSensor: TemplateCampaignTable = {
    name: "user_interaction_sensor",
    display_name: "User Interaction",
    description: "User interaction sensor",
    campaign_table_field: [
        { name: "class_name", field_role: "data", field_type: "categorical" },
        { name: "package_name", field_role: "data", field_type: "categorical" },
        { name: "text", field_role: "data", field_type: "categorical" },
        { name: "event_type", field_role: "data", field_type: "numerical" },
    ],
};

const wifiScanSensor: TemplateCampaignTable = {
    name: "wifi_scan_sensor",
    display_name: "WiFi Scan",
    description: "WiFi scan sensor",
    campaign_table_field: [
        { name: "bssid", field_role: "data", field_type: "categorical" },
        { name: "ssid", field_role: "data", field_type: "categorical" },
        { name: "frequency", field_role: "data", field_type: "numerical" },
        { name: "level", field_role: "data", field_type: "numerical" },
    ],
}

const sleepSensor: TemplateCampaignTable = {
    name: "sleep_sensor",
    display_name: "Sleep",
    description: "Sleep sensor",
    campaign_table_field: [
        { name: "duration", field_role: "data", field_type: "numerical" },
        { name: "sleep_score", field_role: "data", field_type: "numerical" },
        { name: "stages", field_role: "ignore", field_type: "text" },
    ],
};

const exerciseSensor: TemplateCampaignTable = {
    name: "exercise_sensor",
    display_name: "Exercise",
    description: "Exercise sensor",
    campaign_table_field: [
        { name: "duration", field_role: "data", field_type: "numerical" },
        { name: "exercise_type", field_role: "data", field_type: "categorical" },
        { name: "custom_title", field_role: "data", field_type: "categorical" },
        { name: "calories", field_role: "data", field_type: "numerical" },
        { name: "distance", field_role: "data", field_type: "numerical" },
        { name: "count", field_role: "data", field_type: "numerical" },
        { name: "mean_heart_rate", field_role: "data", field_type: "numerical" },
        { name: "max_heart_rate", field_role: "data", field_type: "numerical" },
        { name: "min_heart_rate", field_role: "data", field_type: "numerical" },
        { name: "altitude_gain", field_role: "data", field_type: "numerical" },
        { name: "altitude_loss", field_role: "data", field_type: "numerical" },
        { name: "mean_cadence", field_role: "data", field_type: "numerical" },
        { name: "max_cadence", field_role: "data", field_type: "numerical" },
        { name: "mean_power", field_role: "data", field_type: "numerical" },
        { name: "max_power", field_role: "data", field_type: "numerical" },
        { name: "mean_speed", field_role: "data", field_type: "numerical" },
        { name: "max_speed", field_role: "data", field_type: "numerical" },
        { name: "mean_rpm", field_role: "data", field_type: "numerical" },
        { name: "max_rpm", field_role: "data", field_type: "numerical" },
    ],
};

const ecgSensor: TemplateCampaignTable = {
    name: "ecg_sensor",
    display_name: "ECG",
    description: "ECG sensor",
    campaign_table_field: [
        { name: "ecg_mv", field_role: "data", field_type: "numerical" },
        { name: "lead_off", field_role: "data", field_type: "categorical" },
        { name: "sequence", field_role: "ignore", field_type: "numerical" },
        { name: "ppg_green", field_role: "data", field_type: "numerical" },
        { name: "max_threshold_mv", field_role: "data", field_type: "numerical" },
        { name: "min_threshold_mv", field_role: "data", field_type: "numerical" },
    ],
};

export function useTemplateTable(selectedTables: CampaignTable[]) {
    const selectedTemplateTables = useMemo(() => selectedTables.filter(t => !t.is_custom), [selectedTables]);

    const availableTemplateTables = useMemo<CampaignTable[]>(() => {
        const templateTable: TemplateCampaignTable[] = [
            activityRecognitionSensor,
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
            gestureSensor,
            heartRateSensor,
            imuSensor,
            locationSensor,
            mediaSensor,
            messageLogSensor,
            notificationSensor,
            ppgSensor,
            screenSensor,
            skinTemperatureSensor,
            stepSensor,
            stressSensor,
            userInteractionSensor,
            wifiScanSensor,
            sleepSensor,
            exerciseSensor,
            ecgSensor,
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
                    campaign_table_field_mapping: field.campaign_table_field_mapping?.map((mapping) => ({
                        ...mapping,
                        id: -1,
                        field_id: -1,
                    })) ?? [],
                })),
            }))
    }, [selectedTemplateTables]);

    return { availableTemplateTables };
}
