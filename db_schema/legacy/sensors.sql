-- Battery information
CREATE TABLE battery_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    timestamp TIMESTAMP,
    level REAL NOT NULL,
    plugged TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Data traffic information
CREATE TABLE data_traffic_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    duration INTEGER NOT NULL,
    rx_kilo_bytes INTEGER NOT NULL,
    tx_kilo_bytes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Location information
CREATE TABLE location_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    accuracy REAL NOT NULL,
    altitude REAL NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    speed REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Physical activity information
CREATE TABLE physical_activity_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    confidence REAL NOT NULL,
    activity_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Physical activity transitions
CREATE TABLE physical_activity_transition_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    transition_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Record information
CREATE TABLE record_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    channel_mask TEXT NOT NULL,
    duration INTEGER NOT NULL,
    encoding TEXT NOT NULL,
    path TEXT NOT NULL,
    sample_rate INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- WiFi information
CREATE TABLE wifi_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    bssid TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    rssi INTEGER NOT NULL,
    ssid TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Log information
CREATE TABLE log_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    tag TEXT NOT NULL,
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- App usage events
CREATE TABLE app_usage_event_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    is_system_app BOOLEAN NOT NULL,
    is_updated_system_app BOOLEAN NOT NULL,
    name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- App usage statistics
CREATE TABLE app_usage_stat_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    end_time INTEGER NOT NULL,
    is_system_app BOOLEAN NOT NULL,
    is_updated_system_app BOOLEAN NOT NULL,
    last_time_used INTEGER NOT NULL,
    name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    total_time_foreground INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Connectivity information
CREATE TABLE connectivity_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    is_connected BOOLEAN NOT NULL,
    connection_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Device events
CREATE TABLE device_event_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Installed apps information
CREATE TABLE installed_app_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    first_install_time INTEGER NOT NULL,
    is_system_app BOOLEAN NOT NULL,
    is_updated_system_app BOOLEAN NOT NULL,
    last_update_time INTEGER NOT NULL,
    name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Media information
CREATE TABLE media_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    bucket_display TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Call log information
CREATE TABLE call_log_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    contact TEXT NOT NULL,
    data_usage INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    is_pinned BOOLEAN NOT NULL,
    is_starred BOOLEAN NOT NULL,
    number TEXT NOT NULL,
    presentation TEXT NOT NULL,
    times_contacted INTEGER NOT NULL,
    call_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)      
);

-- Message information
CREATE TABLE message_sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    timestamp TIMESTAMP,
    contact TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL,
    is_starred BOOLEAN NOT NULL,
    message_box TEXT NOT NULL,
    message_class TEXT NOT NULL,
    number TEXT NOT NULL,
    times_contacted INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_battery_sensor_timestamp ON battery_sensor(timestamp);
CREATE INDEX idx_battery_sensor_user_id ON battery_sensor(user_id);

CREATE INDEX idx_data_traffic_sensor_timestamp ON data_traffic_sensor(timestamp);
CREATE INDEX idx_data_traffic_sensor_user_id ON data_traffic_sensor(user_id);

CREATE INDEX idx_location_sensor_timestamp ON location_sensor(timestamp);
CREATE INDEX idx_location_sensor_user_id ON location_sensor(user_id);

CREATE INDEX idx_physical_activity_sensor_timestamp ON physical_activity_sensor(timestamp);
CREATE INDEX idx_physical_activity_sensor_user_id ON physical_activity_sensor(user_id);

CREATE INDEX idx_physical_activity_transition_sensor_timestamp ON physical_activity_transition_sensor(timestamp);
CREATE INDEX idx_physical_activity_transition_sensor_user_id ON physical_activity_transition_sensor(user_id);

CREATE INDEX idx_record_sensor_timestamp ON record_sensor(timestamp);
CREATE INDEX idx_record_sensor_user_id ON record_sensor(user_id);

CREATE INDEX idx_wifi_sensor_timestamp ON wifi_sensor(timestamp);
CREATE INDEX idx_wifi_sensor_user_id ON wifi_sensor(user_id);

CREATE INDEX idx_app_usage_event_sensor_timestamp ON app_usage_event_sensor(timestamp);
CREATE INDEX idx_app_usage_event_sensor_user_id ON app_usage_event_sensor(user_id);

CREATE INDEX idx_app_usage_stat_sensor_timestamp ON app_usage_stat_sensor(timestamp);
CREATE INDEX idx_app_usage_stat_sensor_user_id ON app_usage_stat_sensor(user_id);

CREATE INDEX idx_connectivity_sensor_timestamp ON connectivity_sensor(timestamp);
CREATE INDEX idx_connectivity_sensor_user_id ON connectivity_sensor(user_id);

CREATE INDEX idx_device_event_sensor_timestamp ON device_event_sensor(timestamp);
CREATE INDEX idx_device_event_sensor_user_id ON device_event_sensor(user_id);

CREATE INDEX idx_installed_app_sensor_timestamp ON installed_app_sensor(timestamp);
CREATE INDEX idx_installed_app_sensor_user_id ON installed_app_sensor(user_id);

CREATE INDEX idx_media_sensor_timestamp ON media_sensor(timestamp);
CREATE INDEX idx_media_sensor_user_id ON media_sensor(user_id);

CREATE INDEX idx_call_log_sensor_timestamp ON call_log_sensor(timestamp);
CREATE INDEX idx_call_log_sensor_user_id ON call_log_sensor(user_id);

CREATE INDEX idx_message_sensor_timestamp ON message_sensor(timestamp);
CREATE INDEX idx_message_sensor_user_id ON message_sensor(user_id);

-- 고려 사항: 캠페인에 따라 새로운 센서 데이터 테이블을 추가될 경우, 어떻게 확장할 것인지?
-- 1. 새로운 센서 데이터 테이블을 추가