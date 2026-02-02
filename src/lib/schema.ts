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
                    created_at: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                    x: number
                    y: number
                    z: number
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                    x: number
                    y: number
                    z: number
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                    x?: number
                    y?: number
                    z?: number
                }
                Relationships: []
            }
            ambient_light_sensor: {
                Row: {
                    accuracy: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                    value: number
                }
                Insert: {
                    accuracy: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                    value: number
                }
                Update: {
                    accuracy?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                    value?: number
                }
                Relationships: []
            }
            app_list_change_sensor: {
                Row: {
                    app_list: Json | null
                    changed_app: Json[]
                    created_at: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    app_list?: Json | null
                    changed_app: Json[]
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    app_list?: Json | null
                    changed_app?: Json[]
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            app_usage_log_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    event_type: number
                    installed_by: string
                    package_name: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    event_type: number
                    installed_by: string
                    package_name: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    event_type?: number
                    installed_by?: string
                    package_name?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            battery_sensor: {
                Row: {
                    connected_type: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    level: number
                    received: string
                    status: number
                    temperature: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    connected_type: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    level: number
                    received: string
                    status: number
                    temperature: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    connected_type?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    level?: number
                    received?: string
                    status?: number
                    temperature?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            bluetooth_scan_sensor: {
                Row: {
                    address: string
                    alias: string
                    bond_state: number
                    class_type: number
                    connection_type: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    is_le: boolean
                    name: string
                    received: string
                    rssi: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    address: string
                    alias: string
                    bond_state: number
                    class_type: number
                    connection_type: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    is_le: boolean
                    name: string
                    received: string
                    rssi: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    address?: string
                    alias?: string
                    bond_state?: number
                    class_type?: number
                    connection_type?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    is_le?: boolean
                    name?: string
                    received?: string
                    rssi?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            call_log_sensor: {
                Row: {
                    call_type: number
                    created_at: string | null
                    device_type: number
                    duration: number
                    event_id: string
                    number: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    call_type: number
                    created_at?: string | null
                    device_type: number
                    duration: number
                    event_id: string
                    number: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    call_type?: number
                    created_at?: string | null
                    device_type?: number
                    duration?: number
                    event_id?: string
                    number?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            campaign_table: {
                Row: {
                    campaign_id: number
                    daily_count_max: number
                    description: string
                    id: number
                    is_custom: boolean
                    name: string
                }
                Insert: {
                    campaign_id: number
                    daily_count_max: number
                    description?: string
                    id?: number
                    is_custom?: boolean
                    name: string
                }
                Update: {
                    campaign_id?: number
                    daily_count_max?: number
                    description?: string
                    id?: number
                    is_custom?: boolean
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
                    campaign_table_id: number
                    description: string
                    field_role: Database["public"]["Enums"]["field_role"]
                    field_type: Database["public"]["Enums"]["field_type"]
                    id: number
                    name: string
                }
                Insert: {
                    campaign_table_id: number
                    description?: string
                    field_role: Database["public"]["Enums"]["field_role"]
                    field_type: Database["public"]["Enums"]["field_type"]
                    id?: number
                    name: string
                }
                Update: {
                    campaign_table_id?: number
                    description?: string
                    field_role?: Database["public"]["Enums"]["field_role"]
                    field_type?: Database["public"]["Enums"]["field_type"]
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
            campaign_table_field_mapping: {
                Row: {
                    display: string
                    field_id: number
                    id: number
                    value: string
                }
                Insert: {
                    display: string
                    field_id: number
                    id?: number
                    value: string
                }
                Update: {
                    display?: string
                    field_id?: number
                    id?: number
                    value?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "campaign_table_field_mapping_field_id_fkey"
                        columns: ["field_id"]
                        isOneToOne: false
                        referencedRelation: "campaign_table_field"
                        referencedColumns: ["id"]
                    },
                ]
            }
            campaign_table_row_count: {
                Row: {
                    count: number
                    day: string
                    id: number
                    table_id: number
                    time_slot: number
                    uuid: string
                }
                Insert: {
                    count?: number
                    day: string
                    id?: number
                    table_id: number
                    time_slot: number
                    uuid: string
                }
                Update: {
                    count?: number
                    day?: string
                    id?: number
                    table_id?: number
                    time_slot?: number
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "campaign_table_row_count_table_id_fkey"
                        columns: ["table_id"]
                        isOneToOne: false
                        referencedRelation: "campaign_table"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "campaign_table_row_count_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            campaigns: {
                Row: {
                    created_at: string
                    description: string
                    end_time: string
                    id: number
                    name: string
                    password_hash: string
                    start_time: string
                }
                Insert: {
                    created_at?: string
                    description?: string
                    end_time: string
                    id?: number
                    name: string
                    password_hash?: string
                    start_time: string
                }
                Update: {
                    created_at?: string
                    description?: string
                    end_time?: string
                    id?: number
                    name?: string
                    password_hash?: string
                    start_time?: string
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
                    created_at: string | null
                    device_type: number
                    event_id: string
                    has_internet: boolean
                    is_connected: boolean
                    network_type: string
                    received: string
                    timestamp: string
                    transport_types: string[]
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    has_internet: boolean
                    is_connected: boolean
                    network_type: string
                    received: string
                    timestamp: string
                    transport_types: string[]
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    has_internet?: boolean
                    is_connected?: boolean
                    network_type?: string
                    received?: string
                    timestamp?: string
                    transport_types?: string[]
                    uuid?: string
                }
                Relationships: []
            }
            data_traffic_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    mobile_rx: number
                    mobile_tx: number
                    received: string
                    timestamp: string
                    total_rx: number
                    total_tx: number
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    mobile_rx: number
                    mobile_tx: number
                    received: string
                    timestamp: string
                    total_rx: number
                    total_tx: number
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    mobile_rx?: number
                    mobile_tx?: number
                    received?: string
                    timestamp?: string
                    total_rx?: number
                    total_tx?: number
                    uuid?: string
                }
                Relationships: []
            }
            device_mode_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    event_type: string
                    received: string
                    timestamp: string
                    uuid: string
                    value: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    event_type: string
                    received: string
                    timestamp: string
                    uuid: string
                    value: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    event_type?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                    value?: string
                }
                Relationships: []
            }
            eda_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    received: string
                    skin_conductance: number
                    status: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    received: string
                    skin_conductance: number
                    status: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    received?: string
                    skin_conductance?: number
                    status?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            heart_rate_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    hr: number
                    hr_status: number
                    ibi: number[]
                    ibi_status: number[]
                    received: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    hr: number
                    hr_status: number
                    ibi: number[]
                    ibi_status: number[]
                    received: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    hr?: number
                    hr_status?: number
                    ibi?: number[]
                    ibi_status?: number[]
                    received?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            location_sensor: {
                Row: {
                    accuracy: number
                    altitude: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    latitude: number
                    longitude: number
                    received: string
                    speed: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    accuracy: number
                    altitude: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    latitude: number
                    longitude: number
                    received: string
                    speed: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    accuracy?: number
                    altitude?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    latitude?: number
                    longitude?: number
                    received?: string
                    speed?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            media_sensor: {
                Row: {
                    created_at: string | null
                    date_added: number | null
                    date_modified: number | null
                    device_type: number
                    event_id: string
                    file_name: string | null
                    media_type: string
                    mime_type: string | null
                    operation: string
                    received: string
                    size: number | null
                    storage_type: string
                    timestamp: string
                    uri: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    date_added?: number | null
                    date_modified?: number | null
                    device_type: number
                    event_id: string
                    file_name?: string | null
                    media_type: string
                    mime_type?: string | null
                    operation: string
                    received: string
                    size?: number | null
                    storage_type: string
                    timestamp: string
                    uri: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    date_added?: number | null
                    date_modified?: number | null
                    device_type?: number
                    event_id?: string
                    file_name?: string | null
                    media_type?: string
                    mime_type?: string | null
                    operation?: string
                    received?: string
                    size?: number | null
                    storage_type?: string
                    timestamp?: string
                    uri?: string
                    uuid?: string
                }
                Relationships: []
            }
            message_log_sensor: {
                Row: {
                    contact_type: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    message_type: string
                    number: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    contact_type: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    message_type: string
                    number: string
                    received: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    contact_type?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    message_type?: string
                    number?: string
                    received?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
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
                    created_at: string | null
                    device_type: number
                    event_id: string
                    event_type: string
                    package_name: string
                    received: string
                    text: string
                    timestamp: string
                    title: string
                    uuid: string
                    visibility: number
                }
                Insert: {
                    category: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    event_type: string
                    package_name: string
                    received: string
                    text: string
                    timestamp: string
                    title: string
                    uuid: string
                    visibility: number
                }
                Update: {
                    category?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    event_type?: string
                    package_name?: string
                    received?: string
                    text?: string
                    timestamp?: string
                    title?: string
                    uuid?: string
                    visibility?: number
                }
                Relationships: []
            }
            ppg_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    event_id: string
                    green: number
                    green_status: number
                    ir: number
                    ir_status: number
                    received: string
                    red: number
                    red_status: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    green: number
                    green_status: number
                    ir: number
                    ir_status: number
                    received: string
                    red: number
                    red_status: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    green?: number
                    green_status?: number
                    ir?: number
                    ir_status?: number
                    received?: string
                    red?: number
                    red_status?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
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
                    created_at: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    type: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    received: string
                    timestamp: string
                    type: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    received?: string
                    timestamp?: string
                    type?: string
                    uuid?: string
                }
                Relationships: []
            }
            skin_temperature_sensor: {
                Row: {
                    ambient_temperature: number
                    created_at: string | null
                    device_type: number
                    event_id: string
                    object_temperature: number
                    received: string
                    status: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    ambient_temperature: number
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    object_temperature: number
                    received: string
                    status: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    ambient_temperature?: number
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    object_temperature?: number
                    received?: string
                    status?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            step_sensor: {
                Row: {
                    created_at: string | null
                    device_type: number
                    end_time: number
                    event_id: string
                    received: string
                    start_time: number
                    steps: number
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    created_at?: string | null
                    device_type: number
                    end_time: number
                    event_id: string
                    received: string
                    start_time: number
                    steps: number
                    timestamp: string
                    uuid: string
                }
                Update: {
                    created_at?: string | null
                    device_type?: number
                    end_time?: number
                    event_id?: string
                    received?: string
                    start_time?: number
                    steps?: number
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            survey: {
                Row: {
                    campaign_id: number
                    description: string
                    id: number
                    schedule_method: Json | null
                    title: string
                }
                Insert: {
                    campaign_id: number
                    description: string
                    id?: number
                    schedule_method?: Json | null
                    title: string
                }
                Update: {
                    campaign_id?: number
                    description?: string
                    id?: number
                    schedule_method?: Json | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "survey_campaign_id_fkey"
                        columns: ["campaign_id"]
                        isOneToOne: false
                        referencedRelation: "campaigns"
                        referencedColumns: ["id"]
                    },
                ]
            }
            survey_question: {
                Row: {
                    answer_type: Database["public"]["Enums"]["survey_question_type"]
                    id: number
                    is_mandatory: boolean
                    question: string
                    survey_id: number
                    triggered_by: number | null
                }
                Insert: {
                    answer_type: Database["public"]["Enums"]["survey_question_type"]
                    id?: number
                    is_mandatory: boolean
                    question: string
                    survey_id: number
                    triggered_by?: number | null
                }
                Update: {
                    answer_type?: Database["public"]["Enums"]["survey_question_type"]
                    id?: number
                    is_mandatory?: boolean
                    question?: string
                    survey_id?: number
                    triggered_by?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "survey_question_survey_id_fkey"
                        columns: ["survey_id"]
                        isOneToOne: false
                        referencedRelation: "survey"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "survey_question_triggered_by_fkey"
                        columns: ["triggered_by"]
                        isOneToOne: false
                        referencedRelation: "survey_question_trigger"
                        referencedColumns: ["id"]
                    },
                ]
            }
            survey_question_option: {
                Row: {
                    allow_free_response: boolean
                    display: string
                    id: number
                    question_id: number | null
                }
                Insert: {
                    allow_free_response?: boolean
                    display: string
                    id?: number
                    question_id?: number | null
                }
                Update: {
                    allow_free_response?: boolean
                    display?: string
                    id?: number
                    question_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "survey_question_option_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "survey_question"
                        referencedColumns: ["id"]
                    },
                ]
            }
            survey_question_response: {
                Row: {
                    actual_trigger_time: string
                    created_at: string
                    id: number
                    question_id: number
                    response: Json
                    response_submission_time: string
                    survey_start_time: string
                    trigger_time: string
                    uuid: string
                }
                Insert: {
                    actual_trigger_time: string
                    created_at?: string
                    id?: number
                    question_id: number
                    response: Json
                    response_submission_time: string
                    survey_start_time: string
                    trigger_time: string
                    uuid: string
                }
                Update: {
                    actual_trigger_time?: string
                    created_at?: string
                    id?: number
                    question_id?: number
                    response?: Json
                    response_submission_time?: string
                    survey_start_time?: string
                    trigger_time?: string
                    uuid?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "question_response_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "survey_question"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "question_response_uuid_fkey"
                        columns: ["uuid"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["uuid"]
                    },
                ]
            }
            survey_question_trigger: {
                Row: {
                    expression: Json | null
                    id: number
                    question_id: number | null
                }
                Insert: {
                    expression?: Json | null
                    id?: number
                    question_id?: number | null
                }
                Update: {
                    expression?: Json | null
                    id?: number
                    question_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "survey_question_trigger_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "survey_question"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_interaction_sensor: {
                Row: {
                    class_name: string
                    created_at: string | null
                    device_type: number
                    event_id: string
                    event_type: number
                    package_name: string
                    received: string
                    text: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    class_name: string
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    event_type: number
                    package_name: string
                    received: string
                    text: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    class_name?: string
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    event_type?: number
                    package_name?: string
                    received?: string
                    text?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
            wifi_scan_sensor: {
                Row: {
                    bssid: string
                    created_at: string | null
                    device_type: number
                    event_id: string
                    frequency: number
                    level: number
                    received: string
                    ssid: string
                    timestamp: string
                    uuid: string
                }
                Insert: {
                    bssid: string
                    created_at?: string | null
                    device_type: number
                    event_id: string
                    frequency: number
                    level: number
                    received: string
                    ssid: string
                    timestamp: string
                    uuid: string
                }
                Update: {
                    bssid?: string
                    created_at?: string | null
                    device_type?: number
                    event_id?: string
                    frequency?: number
                    level?: number
                    received?: string
                    ssid?: string
                    timestamp?: string
                    uuid?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            add_compression_policy: {
                Args: {
                    compress_after?: unknown
                    compress_created_before?: string
                    hypertable: unknown
                    if_not_exists?: boolean
                    initial_start?: string
                    schedule_interval?: string
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
                    schedule_interval: string
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
                    schedule_interval: string
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
                    drop_created_before?: string
                    if_not_exists?: boolean
                    initial_start?: string
                    relation: unknown
                    schedule_interval?: string
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
                    max_runtime?: string
                    next_start?: string
                    retry_period?: string
                    schedule_interval?: string
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
                    max_runtime: string
                    next_start: string
                    retry_period: string
                    schedule_interval: string
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
                    category: string
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
                    avg: number
                    bucket: string
                    max: number
                    min: number
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
            | { Args: { bucket_width: string; ts: string }; Returns: string }
            | {
                Args: { bucket_width: string; offset: string; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: string; origin: string; ts: string }
                Returns: string
            }
            | { Args: { bucket_width: string; ts: string }; Returns: string }
            | {
                Args: { bucket_width: string; offset: string; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: string; origin: string; ts: string }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: string
                    offset?: string
                    origin?: string
                    timezone: string
                    ts: string
                }
                Returns: string
            }
            | { Args: { bucket_width: string; ts: string }; Returns: string }
            | {
                Args: { bucket_width: string; offset: string; ts: string }
                Returns: string
            }
            | {
                Args: { bucket_width: string; origin: string; ts: string }
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
                    bucket_width: string
                    finish?: string
                    start?: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: string
                    finish?: string
                    start?: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: string
                    finish?: string
                    start?: string
                    timezone: string
                    ts: string
                }
                Returns: string
            }
            | {
                Args: {
                    bucket_width: string
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
            field_role: "uid" | "timestamp" | "data" | "ignore"
            field_type: "categorical" | "numerical" | "datetime" | "text" | "bitmask"
            survey_question_type: "checkbox" | "radio" | "text" | "number"
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
        Enums: {
            field_role: ["uid", "timestamp", "data", "ignore"],
            field_type: ["categorical", "numerical", "datetime", "text", "bitmask"],
            survey_question_type: ["checkbox", "radio", "text", "number"],
        },
    },
} as const

