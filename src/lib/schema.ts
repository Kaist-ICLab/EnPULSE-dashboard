export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            accelerometer_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid: string
                    x: number
                    y: number
                    z: number
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid?: string
                    x: number
                    y: number
                    z: number
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    received?: number
                    timestamp?: number
                    uuid?: string
                    x?: number
                    y?: number
                    z?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "accelerometer_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            ambient_light_sensor: {
                Row: {
                    accuracy: number
                    created_at: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid: string
                    value: number
                }
                Insert: {
                    accuracy: number
                    created_at?: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid?: string
                    value: number
                }
                Update: {
                    accuracy?: number
                    created_at?: string
                    device_type?: number
                    received?: number
                    timestamp?: number
                    uuid?: string
                    value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "ambient_light_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            app_list_change_sensor: {
                Row: {
                    app_list: Json[] | null
                    changed_app: Json
                    created_at: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    app_list?: Json[] | null
                    changed_app: Json
                    created_at?: string
                    device_type: number
                    received: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    app_list?: Json[] | null
                    changed_app?: Json
                    created_at?: string
                    device_type?: number
                    received?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "app_list_change_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            app_usage_log_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    event_type: number
                    installed_by: string
                    package_name: string
                    received: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    event_type: number
                    installed_by: string
                    package_name: string
                    received: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    event_type?: number
                    installed_by?: string
                    package_name?: string
                    received?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "app_usage_log_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            battery_sensor: {
                Row: {
                    connected_type: number
                    created_at: string
                    device_type: number
                    level: number
                    received: number
                    status: number
                    temperature: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    connected_type: number
                    created_at?: string
                    device_type: number
                    level: number
                    received: number
                    status: number
                    temperature: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    connected_type?: number
                    created_at?: string
                    device_type?: number
                    level?: number
                    received?: number
                    status?: number
                    temperature?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "battery_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                    {
                        foreignKeyName: "battery_sensor_uuid_fkey1"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            bluetooth_scan_sensor: {
                Row: {
                    address: string
                    alias: string
                    bond_state: number
                    class_type: number
                    connection_type: number
                    created_at: string
                    device_type: number
                    is_le: boolean
                    name: string
                    received: number
                    rssi: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    address: string
                    alias: string
                    bond_state: number
                    class_type: number
                    connection_type: number
                    created_at?: string
                    device_type: number
                    is_le: boolean
                    name: string
                    received: number
                    rssi: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    address?: string
                    alias?: string
                    bond_state?: number
                    class_type?: number
                    connection_type?: number
                    created_at?: string
                    device_type?: number
                    is_le?: boolean
                    name?: string
                    received?: number
                    rssi?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "bluetooth_scan_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            call_log_sensor: {
                Row: {
                    call_type: number
                    created_at: string
                    device_type: number
                    duration: number
                    number: string
                    received: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    call_type: number
                    created_at?: string
                    device_type: number
                    duration: number
                    number: string
                    received: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    call_type?: number
                    created_at?: string
                    device_type?: number
                    duration?: number
                    number?: string
                    received?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "call_log_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            campaign_table: {
                Row: {
                    campaign_id: number
                    daily_count_max: number
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    campaign_id: number
                    daily_count_max: number
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    campaign_id?: number
                    daily_count_max?: number
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "campaign_table_campaign_id_fkey"
                        columns: ["campaign_id"]
                        isOneToOne: false
                        referencedRelation: "campaigns"
                        referencedColumns: ["id"]
                    },
                ]
            }
            campaign_table_field: {
                Row: {
                    campaign_id: number
                    campaign_table_id: number
                    description: string | null
                    field_role: string
                    field_type: string
                    id: number
                    name: string
                }
                Insert: {
                    campaign_id: number
                    campaign_table_id: number
                    description?: string | null
                    field_role: string
                    field_type: string
                    id?: number
                    name: string
                }
                Update: {
                    campaign_id?: number
                    campaign_table_id?: number
                    description?: string | null
                    field_role?: string
                    field_type?: string
                    id?: number
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "campaign_table_field_campaign_table_id_fkey"
                        columns: ["campaign_table_id"]
                        isOneToOne: false
                        referencedRelation: "campaign_table"
                        referencedColumns: ["id"]
                    },
                ]
            }
            campaign_table_user_daily_summary: {
                Row: {
                    campaign_table_id: number | null
                    day: string | null
                    hourly_count_0: number
                    hourly_count_1: number
                    hourly_count_2: number
                    hourly_count_3: number
                    hourly_count_4: number
                    hourly_count_5: number
                    hourly_count_6: number
                    hourly_count_7: number
                    id: number
                    uuid: string
                }
                Insert: {
                    campaign_table_id?: number | null
                    day?: string | null
                    hourly_count_0: number
                    hourly_count_1: number
                    hourly_count_2: number
                    hourly_count_3: number
                    hourly_count_4: number
                    hourly_count_5: number
                    hourly_count_6: number
                    hourly_count_7: number
                    id?: number
                    uuid: string
                }
                Update: {
                    campaign_table_id?: number | null
                    day?: string | null
                    hourly_count_0?: number
                    hourly_count_1?: number
                    hourly_count_2?: number
                    hourly_count_3?: number
                    hourly_count_4?: number
                    hourly_count_5?: number
                    hourly_count_6?: number
                    hourly_count_7?: number
                    id?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "campaign_table_user_daily_summary_campaign_table_id_fkey"
                        columns: ["campaign_table_id"]
                        isOneToOne: false
                        referencedRelation: "campaign_table"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "campaign_table_user_daily_summary_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            campaigns: {
                Row: {
                    created_at: string | null
                    id: number
                    name: string
                }
                Insert: {
                    created_at?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    created_at?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            chat_sessions: {
                Row: {
                    campaign_id: number | null
                    created_at: string
                    id: number
                    last_message: string | null
                    last_message_time: string
                    unread_count: number
                    uuid: string | null
                }
                Insert: {
                    campaign_id?: number | null
                    created_at?: string
                    id?: number
                    last_message?: string | null
                    last_message_time?: string
                    unread_count?: number
                    uuid?: string | null
                }
                Update: {
                    campaign_id?: number | null
                    created_at?: string
                    id?: number
                    last_message?: string | null
                    last_message_time?: string
                    unread_count?: number
                    uuid?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "chat_sessions_campaign_id_fkey"
                        columns: ["campaign_id"]
                        isOneToOne: false
                        referencedRelation: "campaigns"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "chat_sessions_uuid_fkey1"
                        columns: ["uuid"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            connectivity_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    has_internet: boolean
                    is_connected: boolean
                    network_type: string
                    received: number
                    timestamp: number
                    transport_types: string[]
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    has_internet: boolean
                    is_connected: boolean
                    network_type: string
                    received: number
                    timestamp: number
                    transport_types: string[]
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    has_internet?: boolean
                    is_connected?: boolean
                    network_type?: string
                    received?: number
                    timestamp?: number
                    transport_types?: string[]
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "connectivity_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            data_traffic_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    mobile_rx: number
                    mobile_tx: number
                    received: number
                    timestamp: number
                    total_rx: number
                    total_tx: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    mobile_rx: number
                    mobile_tx: number
                    received: number
                    timestamp: number
                    total_rx: number
                    total_tx: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    mobile_rx?: number
                    mobile_tx?: number
                    received?: number
                    timestamp?: number
                    total_rx?: number
                    total_tx?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "data_traffic_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            device_mode_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    event_type: string
                    received: number
                    timestamp: number
                    uuid: string
                    value: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    event_type: string
                    received: number
                    timestamp: number
                    uuid?: string
                    value: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    event_type?: string
                    received?: number
                    timestamp?: number
                    uuid?: string
                    value?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "device_mode_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            eda_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    received: number
                    skin_conductance: number
                    status: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    received: number
                    skin_conductance: number
                    status: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    received?: number
                    skin_conductance?: number
                    status?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "eda_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            heart_rate_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    hr: number
                    hr_status: number
                    ibi: number[]
                    ibi_status: number[]
                    received: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    hr: number
                    hr_status: number
                    ibi: number[]
                    ibi_status: number[]
                    received: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    hr?: number
                    hr_status?: number
                    ibi?: number[]
                    ibi_status?: number[]
                    received?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "heart_rate_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            location_sensor: {
                Row: {
                    accuracy: number
                    altitude: number
                    created_at: string
                    device_type: number
                    latitude: number
                    longitude: number
                    received: number
                    speed: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    accuracy: number
                    altitude: number
                    created_at?: string
                    device_type: number
                    latitude: number
                    longitude: number
                    received: number
                    speed: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    accuracy?: number
                    altitude?: number
                    created_at?: string
                    device_type?: number
                    latitude?: number
                    longitude?: number
                    received?: number
                    speed?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "location_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            media_sensor: {
                Row: {
                    created_at: string
                    date_added: number | null
                    date_modified: number | null
                    device_type: number
                    file_name: string | null
                    media_type: string
                    mime_type: string | null
                    operation: string
                    received: number
                    size: number | null
                    storage_type: string
                    timestamp: number
                    uri: string
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    date_added?: number | null
                    date_modified?: number | null
                    device_type: number
                    file_name?: string | null
                    media_type: string
                    mime_type?: string | null
                    operation: string
                    received: number
                    size?: number | null
                    storage_type: string
                    timestamp: number
                    uri: string
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    date_added?: number | null
                    date_modified?: number | null
                    device_type?: number
                    file_name?: string | null
                    media_type?: string
                    mime_type?: string | null
                    operation?: string
                    received?: number
                    size?: number | null
                    storage_type?: string
                    timestamp?: number
                    uri?: string
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "media_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            message_log_sensor: {
                Row: {
                    contact_type: number
                    created_at: string
                    device_type: number
                    message_type: string
                    number: string
                    received: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    contact_type: number
                    created_at?: string
                    device_type: number
                    message_type: string
                    number: string
                    received: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    contact_type?: number
                    created_at?: string
                    device_type?: number
                    message_type?: string
                    number?: string
                    received?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "message_log_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            messages: {
                Row: {
                    content: string
                    created_at: string
                    id: number
                    is_read: boolean | null
                    message_type: string
                    sender_type: string
                    session_id: number
                    title: string | null
                    uuid: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    id?: number
                    is_read?: boolean | null
                    message_type: string
                    sender_type: string
                    session_id: number
                    title?: string | null
                    uuid: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    id?: number
                    is_read?: boolean | null
                    message_type?: string
                    sender_type?: string
                    session_id?: number
                    title?: string | null
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_session_id_fkey"
                        columns: ["session_id"]
                        isOneToOne: false
                        referencedRelation: "chat_sessions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_uuid_fkey1"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            notification_sensor: {
                Row: {
                    category: number
                    created_at: string
                    device_type: number
                    event_type: string
                    package_name: string
                    received: number
                    text: string
                    timestamp: number
                    title: string
                    uuid: string
                    visibility: number
                }
                Insert: {
                    category: number
                    created_at?: string
                    device_type: number
                    event_type: string
                    package_name: string
                    received: number
                    text: string
                    timestamp: number
                    title: string
                    uuid?: string
                    visibility: number
                }
                Update: {
                    category?: number
                    created_at?: string
                    device_type?: number
                    event_type?: string
                    package_name?: string
                    received?: number
                    text?: string
                    timestamp?: number
                    title?: string
                    uuid?: string
                    visibility?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "notification_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            ppg_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    green: number
                    green_status: number
                    ir: number
                    ir_status: number
                    received: number
                    red: number
                    red_status: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    green: number
                    green_status: number
                    ir: number
                    ir_status: number
                    received: number
                    red: number
                    red_status: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    green?: number
                    green_status?: number
                    ir?: number
                    ir_status?: number
                    received?: number
                    red?: number
                    red_status?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "ppg_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            profiles: {
                Row: {
                    campaign_id: number | null
                    email: string
                    uuid: string
                }
                Insert: {
                    campaign_id?: number | null
                    email: string
                    uuid: string
                }
                Update: {
                    campaign_id?: number | null
                    email?: string
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_campaign_id_fkey"
                        columns: ["campaign_id"]
                        isOneToOne: false
                        referencedRelation: "campaigns"
                        referencedColumns: ["id"]
                    },
                ]
            }
            screen_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    received: number
                    timestamp: number
                    type: string
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    received: number
                    timestamp: number
                    type: string
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    received?: number
                    timestamp?: number
                    type?: string
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "screen_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            skin_temperature_sensor: {
                Row: {
                    ambient_temperature: number
                    created_at: string
                    device_type: number
                    object_temperature: number
                    received: number
                    status: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    ambient_temperature: number
                    created_at?: string
                    device_type: number
                    object_temperature: number
                    received: number
                    status: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    ambient_temperature?: number
                    created_at?: string
                    device_type?: number
                    object_temperature?: number
                    received?: number
                    status?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "skin_temperature_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            step_sensor: {
                Row: {
                    created_at: string
                    device_type: number
                    end_time: number
                    received: number
                    start_time: number
                    steps: number
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    device_type: number
                    end_time: number
                    received: number
                    start_time: number
                    steps: number
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    device_type?: number
                    end_time?: number
                    received?: number
                    start_time?: number
                    steps?: number
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "step_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            user_interaction_sensor: {
                Row: {
                    class_name: string
                    created_at: string
                    device_type: number
                    event_type: number
                    package_name: string
                    received: number
                    text: string
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    class_name: string
                    created_at?: string
                    device_type: number
                    event_type: number
                    package_name: string
                    received: number
                    text: string
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    class_name?: string
                    created_at?: string
                    device_type?: number
                    event_type?: number
                    package_name?: string
                    received?: number
                    text?: string
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_interaction_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            wifi_scan_sensor: {
                Row: {
                    bssid: string
                    created_at: string
                    device_type: number
                    frequency: number
                    level: number
                    received: number
                    ssid: string
                    timestamp: number
                    uuid: string
                }
                Insert: {
                    bssid: string
                    created_at?: string
                    device_type: number
                    frequency: number
                    level: number
                    received: number
                    ssid: string
                    timestamp: number
                    uuid?: string
                }
                Update: {
                    bssid?: string
                    created_at?: string
                    device_type?: number
                    frequency?: number
                    level?: number
                    received?: number
                    ssid?: string
                    timestamp?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "wifi_scan_sensor_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            add_compression_policy: {
                Args: {
                    compress_after?: unknown
                    compress_created_before?: unknown
                    hypertable: unknown
                    if_not_exists?: boolean
                    initial_start?: string
                    schedule_interval?: unknown
                    timezone?: string
                }
                Returns: number
            }
            add_continuous_aggregate_policy: {
                Args: {
                    continuous_aggregate: unknown
                    end_offset: unknown
                    if_not_exists?: boolean
                    initial_start?: string
                    schedule_interval: unknown
                    start_offset: unknown
                    timezone?: string
                }
                Returns: number
            }
            add_dimension:
            | {
                Args: {
                    chunk_time_interval?: unknown
                    column_name: unknown
                    hypertable: unknown
                    if_not_exists?: boolean
                    number_partitions?: number
                    partitioning_func?: unknown
                }
                Returns: {
                    column_name: unknown
                    created: boolean
                    dimension_id: number
                    schema_name: unknown
                    table_name: unknown
                }[]
            }
            | {
                Args: {
                    dimension: unknown
                    hypertable: unknown
                    if_not_exists?: boolean
                }
                Returns: {
                    created: boolean
                    dimension_id: number
                }[]
            }
            add_job: {
                Args: {
                    check_config?: unknown
                    config?: Json
                    fixed_schedule?: boolean
                    initial_start?: string
                    proc: unknown
                    schedule_interval: unknown
                    scheduled?: boolean
                    timezone?: string
                }
                Returns: number
            }
            add_reorder_policy: {
                Args: {
                    hypertable: unknown
                    if_not_exists?: boolean
                    index_name: unknown
                    initial_start?: string
                    timezone?: string
                }
                Returns: number
            }
            add_retention_policy: {
                Args: {
                    drop_after?: unknown
                    drop_created_before?: unknown
                    if_not_exists?: boolean
                    initial_start?: string
                    relation: unknown
                    schedule_interval?: unknown
                    timezone?: string
                }
                Returns: number
            }
            alter_job: {
                Args: {
                    check_config?: unknown
                    config?: Json
                    fixed_schedule?: boolean
                    if_exists?: boolean
                    initial_start?: string
                    job_id: number
                    max_retries?: number
                    max_runtime?: unknown
                    next_start?: string
                    retry_period?: unknown
                    schedule_interval?: unknown
                    scheduled?: boolean
                    timezone?: string
                }
                Returns: {
                    check_config: string
                    config: Json
                    fixed_schedule: boolean
                    initial_start: string
                    job_id: number
                    max_retries: number
                    max_runtime: unknown
                    next_start: string
                    retry_period: unknown
                    schedule_interval: unknown
                    scheduled: boolean
                    timezone: string
                }[]
            }
            approximate_row_count: { Args: { relation: unknown }; Returns: number }
            attach_tablespace: {
                Args: {
                    hypertable: unknown
                    if_not_attached?: boolean
                    tablespace: unknown
                }
                Returns: undefined
            }
            bucket_categorical_data: {
                Args: {
                    bucket_unit: string
                    column_name: string
                    end_time: string
                    start_time: string
                    table_name: string
                    uuid: string
                }
                Returns: {
                    bucket: string
                    category: number
                    count: number
                }[]
            }
            bucket_numerical_data: {
                Args: {
                    bucket_unit: string
                    column_name: string
                    end_time: string
                    start_time: string
                    table_name: string
                    uuid: string
                }
                Returns: {
                    avg_value: number
                    bucket: string
                    max_value: number
                    min_value: number
                }[]
            }
            by_hash: {
                Args: {
                    column_name: unknown
                    number_partitions: number
                    partition_func?: unknown
                }
                Returns: unknown
            }
            by_range: {
                Args: {
                    column_name: unknown
                    partition_func?: unknown
                    partition_interval?: unknown
                }
                Returns: unknown
            }
            chunk_compression_stats: {
                Args: { hypertable: unknown }
                Returns: {
                    after_compression_index_bytes: number
                    after_compression_table_bytes: number
                    after_compression_toast_bytes: number
                    after_compression_total_bytes: number
                    before_compression_index_bytes: number
                    before_compression_table_bytes: number
                    before_compression_toast_bytes: number
                    before_compression_total_bytes: number
                    chunk_name: unknown
                    chunk_schema: unknown
                    compression_status: string
                    node_name: unknown
                }[]
            }
            chunks_detailed_size: {
                Args: { hypertable: unknown }
                Returns: {
                    chunk_name: unknown
                    chunk_schema: unknown
                    index_bytes: number
                    node_name: unknown
                    table_bytes: number
                    toast_bytes: number
                    total_bytes: number
                }[]
            }
            compress_chunk: {
                Args: {
                    if_not_compressed?: boolean
                    recompress?: boolean
                    uncompressed_chunk: unknown
                }
                Returns: unknown
            }
            create_hypertable:
            | {
                Args: {
                    create_default_indexes?: boolean
                    dimension: unknown
                    if_not_exists?: boolean
                    migrate_data?: boolean
                    relation: unknown
                }
                Returns: {
                    created: boolean
                    hypertable_id: number
                }[]
            }
            | {
                Args: {
                    associated_schema_name?: unknown
                    associated_table_prefix?: unknown
                    chunk_sizing_func?: unknown
                    chunk_target_size?: string
                    chunk_time_interval?: unknown
                    create_default_indexes?: boolean
                    if_not_exists?: boolean
                    migrate_data?: boolean
                    number_partitions?: number
                    partitioning_column?: unknown
                    partitioning_func?: unknown
                    relation: unknown
                    time_column_name: unknown
                    time_partitioning_func?: unknown
                }
                Returns: {
                    created: boolean
                    hypertable_id: number
                    schema_name: unknown
                    table_name: unknown
                }[]
            }
            decompress_chunk: {
                Args: { if_compressed?: boolean; uncompressed_chunk: unknown }
                Returns: unknown
            }
            delete_job: { Args: { job_id: number }; Returns: undefined }
            detach_tablespace: {
                Args: {
                    hypertable?: unknown
                    if_attached?: boolean
                    tablespace: unknown
                }
                Returns: number
            }
            detach_tablespaces: { Args: { hypertable: unknown }; Returns: number }
            disable_chunk_skipping: {
                Args: {
                    column_name: unknown
                    hypertable: unknown
                    if_not_exists?: boolean
                }
                Returns: {
                    column_name: unknown
                    disabled: boolean
                    hypertable_id: number
                }[]
            }
            drop_chunks: {
                Args: {
                    created_after?: unknown
                    created_before?: unknown
                    newer_than?: unknown
                    older_than?: unknown
                    relation: unknown
                    verbose?: boolean
                }
                Returns: string[]
            }
            enable_chunk_skipping: {
                Args: {
                    column_name: unknown
                    hypertable: unknown
                    if_not_exists?: boolean
                }
                Returns: {
                    column_stats_id: number
                    enabled: boolean
                }[]
            }
            get_telemetry_report: { Args: never; Returns: Json }
            hypertable_approximate_detailed_size: {
                Args: { relation: unknown }
                Returns: {
                    index_bytes: number
                    table_bytes: number
                    toast_bytes: number
                    total_bytes: number
                }[]
            }
            hypertable_approximate_size: {
                Args: { hypertable: unknown }
                Returns: number
            }
            hypertable_compression_stats: {
                Args: { hypertable: unknown }
                Returns: {
                    after_compression_index_bytes: number
                    after_compression_table_bytes: number
                    after_compression_toast_bytes: number
                    after_compression_total_bytes: number
                    before_compression_index_bytes: number
                    before_compression_table_bytes: number
                    before_compression_toast_bytes: number
                    before_compression_total_bytes: number
                    node_name: unknown
                    number_compressed_chunks: number
                    total_chunks: number
                }[]
            }
            hypertable_detailed_size: {
                Args: { hypertable: unknown }
                Returns: {
                    index_bytes: number
                    node_name: unknown
                    table_bytes: number
                    toast_bytes: number
                    total_bytes: number
                }[]
            }
            hypertable_index_size: { Args: { index_name: unknown }; Returns: number }
            hypertable_size: { Args: { hypertable: unknown }; Returns: number }
            interpolate:
            | {
                Args: {
                    next?: Record<string, unknown>
                    prev?: Record<string, unknown>
                    value: number
                }
                Returns: number
            }
            | {
                Args: {
                    next?: Record<string, unknown>
                    prev?: Record<string, unknown>
                    value: number
                }
                Returns: number
            }
            | {
                Args: {
                    next?: Record<string, unknown>
                    prev?: Record<string, unknown>
                    value: number
                }
                Returns: number
            }
            | {
                Args: {
                    next?: Record<string, unknown>
                    prev?: Record<string, unknown>
                    value: number
                }
                Returns: number
            }
            | {
                Args: {
                    next?: Record<string, unknown>
                    prev?: Record<string, unknown>
                    value: number
                }
                Returns: number
            }
            locf: {
                Args: {
                    prev?: unknown
                    treat_null_as_missing?: boolean
                    value: unknown
                }
                Returns: unknown
            }
            move_chunk: {
                Args: {
                    chunk: unknown
                    destination_tablespace: unknown
                    index_destination_tablespace?: unknown
                    reorder_index?: unknown
                    verbose?: boolean
                }
                Returns: undefined
            }
            remove_compression_policy: {
                Args: { hypertable: unknown; if_exists?: boolean }
                Returns: boolean
            }
            remove_continuous_aggregate_policy: {
                Args: {
                    continuous_aggregate: unknown
                    if_exists?: boolean
                    if_not_exists?: boolean
                }
                Returns: undefined
            }
            remove_reorder_policy: {
                Args: { hypertable: unknown; if_exists?: boolean }
                Returns: undefined
            }
            remove_retention_policy: {
                Args: { if_exists?: boolean; relation: unknown }
                Returns: undefined
            }
            reorder_chunk: {
                Args: { chunk: unknown; index?: unknown; verbose?: boolean }
                Returns: undefined
            }
            set_adaptive_chunking: {
                Args: {
                    chunk_sizing_func?: unknown
                    chunk_target_size: string
                    hypertable: unknown
                }
                Returns: Record<string, unknown>
            }
            set_chunk_time_interval: {
                Args: {
                    chunk_time_interval: unknown
                    dimension_name?: unknown
                    hypertable: unknown
                }
                Returns: undefined
            }
            set_integer_now_func: {
                Args: {
                    hypertable: unknown
                    integer_now_func: unknown
                    replace_if_exists?: boolean
                }
                Returns: undefined
            }
            set_number_partitions: {
                Args: {
                    dimension_name?: unknown
                    hypertable: unknown
                    number_partitions: number
                }
                Returns: undefined
            }
            set_partitioning_interval: {
                Args: {
                    dimension_name?: unknown
                    hypertable: unknown
                    partition_interval: unknown
                }
                Returns: undefined
            }
            show_chunks: {
                Args: {
                    created_after?: unknown
                    created_before?: unknown
                    newer_than?: unknown
                    older_than?: unknown
                    relation: unknown
                }
                Returns: unknown[]
            }
            show_tablespaces: { Args: { hypertable: unknown }; Returns: unknown[] }
            time_bucket:
            | { Args: { bucket_width: number; ts: number }; Returns: number }
            | {
                Args: { bucket_width: number; offset: number; ts: number }
                Returns: number
            }
            | { Args: { bucket_width: number; ts: number }; Returns: number }
            | {
                Args: { bucket_width: number; offset: number; ts: number }
                Returns: number
            }
            | { Args: { bucket_width: unknown; ts: string }; Returns: string }
            | {
                Args: { bucket_width: unknown; offset: unknown; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: unknown; origin: string; ts: string }
                Returns: string
            }
            | { Args: { bucket_width: unknown; ts: string }; Returns: string }
            | {
                Args: { bucket_width: unknown; offset: unknown; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: unknown; origin: string; ts: string }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: unknown
                    offset?: unknown
                    origin?: string
                    timezone: string
                    ts: string
                }
                Returns: string
            }
            | { Args: { bucket_width: unknown; ts: string }; Returns: string }
            | {
                Args: { bucket_width: unknown; offset: unknown; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: unknown; origin: string; ts: string }
                Returns: string
            }
            | { Args: { bucket_width: number; ts: number }; Returns: number }
            | {
                Args: { bucket_width: number; offset: number; ts: number }
                Returns: number
            }
            time_bucket_gapfill:
            | {
                Args: {
                    bucket_width: number
                    finish?: number
                    start?: number
                    ts: number
                }
                Returns: number
            }
            | {
                Args: {
                    bucket_width: number
                    finish?: number
                    start?: number
                    ts: number
                }
                Returns: number
            }
            | {
                Args: {
                    bucket_width: unknown
                    finish?: string
                    start?: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: unknown
                    finish?: string
                    start?: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: unknown
                    finish?: string
                    start?: string
                    timezone: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: unknown
                    finish?: string
                    start?: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: number
                    finish?: number
                    start?: number
                    ts: number
                }
                Returns: number
            }
            timescaledb_post_restore: { Args: never; Returns: boolean }
            timescaledb_pre_restore: { Args: never; Returns: boolean }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const

