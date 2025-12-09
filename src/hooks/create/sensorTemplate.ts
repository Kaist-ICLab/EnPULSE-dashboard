import { NewCampaignTable } from "./useNewCampaignTables";

const appUsageEventSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "app_usage_event_sensor",
    description: "App usage event sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_updated_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "name",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "package_name",
            field_role: "data",
            field_type: "categorical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "event_type",
            field_role: "data",
            field_type: "categorical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const appUsageStatSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "app_usage_stat_sensor",
    description: "App usage statistics sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "end_time",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_updated_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "last_time_used",
            field_role: "data",
            field_type: "numerical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "name",
            field_role: "data",
            field_type: "categorical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "package_name",
            field_role: "data",
            field_type: "categorical",
            id: 7,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "start_time",
            field_role: "data",
            field_type: "numerical",
            id: 8,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "total_time_foreground",
            field_role: "data",
            field_type: "numerical",
            id: 9,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const batterySensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "battery_sensor",
    description: "Battery sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "level",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "plugged",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "status",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "temperature",
            field_role: "data",
            field_type: "numerical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const dataTrafficSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "data_traffic_sensor",
    description: "Data traffic sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "totalRx",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "totalTx",
            field_role: "data",
            field_type: "numerical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "mobileRx",
            field_role: "data",
            field_type: "numerical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "mobileTx",
            field_role: "data",
            field_type: "numerical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const locationSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "location_sensor",
    description: "Location sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "accuracy",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "altitude",
            field_role: "data",
            field_type: "numerical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "latitude",
            field_role: "data",
            field_type: "numerical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "longitude",
            field_role: "data",
            field_type: "numerical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "speed",
            field_role: "data",
            field_type: "numerical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const physicalActivitySensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "physical_activity_sensor",
    description: "Physical activity sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "confidence",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "activity_type",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const physicalActivityTransitionSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "physical_activity_transition_sensor",
    description: "Physical activity transition sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "transition_type",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const recordSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "record_sensor",
    description: "Record sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "channel_mask",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "duration",
            field_role: "data",
            field_type: "numerical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "encoding",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "path",
            field_role: "data",
            field_type: "categorical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "sample_rate",
            field_role: "data",
            field_type: "numerical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const wifiSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "wifi_sensor",
    description: "WiFi sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "bssid",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "frequency",
            field_role: "data",
            field_type: "numerical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "rssi",
            field_role: "data",
            field_type: "numerical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "ssid",
            field_role: "data",
            field_type: "categorical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const logSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "log_sensor",
    description: "Log sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "email",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "message",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "tag",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const connectivitySensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "connectivity_sensor",
    description: "Connectivity sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_connected",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "connection_type",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const deviceEventSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "device_event_sensor",
    description: "Device event sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "event_type",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const installedAppSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "installed_app_sensor",
    description: "Installed app sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "first_install_time",
            field_role: "data",
            field_type: "numerical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_updated_system_app",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "last_update_time",
            field_role: "data",
            field_type: "numerical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "name",
            field_role: "data",
            field_type: "categorical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "package_name",
            field_role: "data",
            field_type: "categorical",
            id: 7,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const mediaSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "media_sensor",
    description: "Media sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "bucket_display",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "mimetype",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const callLogSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "call_log_sensor",
    description: "Call log sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "contact",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "data_usage",
            field_role: "data",
            field_type: "numerical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "duration",
            field_role: "data",
            field_type: "numerical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_pinned",
            field_role: "data",
            field_type: "categorical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_starred",
            field_role: "data",
            field_type: "categorical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "number",
            field_role: "data",
            field_type: "categorical",
            id: 7,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "presentation",
            field_role: "data",
            field_type: "categorical",
            id: 8,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "times_contacted",
            field_role: "data",
            field_type: "numerical",
            id: 9,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "call_type",
            field_role: "data",
            field_type: "categorical",
            id: 10,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

const messageSensor: NewCampaignTable = {
    id: -1,
    campaign_id: -1,
    name: "message_sensor",
    description: "Message sensor",
    daily_count_max: 0,
    fields: [
        {
            name: "uuid",
            field_role: "uid",
            field_type: "categorical",
            id: 0,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "timestamp",
            field_role: "timestamp",
            field_type: "datetime",
            id: 1,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "contact",
            field_role: "data",
            field_type: "categorical",
            id: 2,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_pinned",
            field_role: "data",
            field_type: "categorical",
            id: 3,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "is_starred",
            field_role: "data",
            field_type: "categorical",
            id: 4,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "message_box",
            field_role: "data",
            field_type: "categorical",
            id: 5,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "message_class",
            field_role: "data",
            field_type: "categorical",
            id: 6,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "number",
            field_role: "data",
            field_type: "categorical",
            id: 7,
            campaign_id: -1,
            campaign_table_id: -1
        },
        {
            name: "times_contacted",
            field_role: "data",
            field_type: "numerical",
            id: 8,
            campaign_id: -1,
            campaign_table_id: -1
        }
    ]
}

export const templateTable: NewCampaignTable[] = [
    appUsageEventSensor,
    appUsageStatSensor,
    batterySensor,
    dataTrafficSensor,
    locationSensor,
    physicalActivitySensor,
    physicalActivityTransitionSensor,
    recordSensor,
    wifiSensor,
    logSensor,
    connectivitySensor,
    deviceEventSensor,
    installedAppSensor,
    mediaSensor,
    callLogSensor,
    messageSensor,
]
