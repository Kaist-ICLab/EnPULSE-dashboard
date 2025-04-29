-- Insert campaigns
INSERT INTO campaigns (id, name, created_at) 
VALUES 
    (1, 'Health Monitoring Study', CURRENT_TIMESTAMP),
    (2, 'Environmental Research', CURRENT_TIMESTAMP),
    (3, 'Urban Mobility Study', CURRENT_TIMESTAMP);

-- Insert campaign tables
INSERT INTO campaign_table (id, campaign_id, name, description, daily_count_max) 
VALUES 
    -- Health Monitoring Study tables
    (1, 1, 'activity_sensor', 'Records daily physical activity data', 1000),
    (2, 1, 'sleep_sensor', 'Records sleep quality and duration', 24),
    (3, 1, 'heart_rate_sensor', 'Records heart rate measurements', 1440),
    
    -- Environmental Research tables
    (4, 2, 'air_quality_sensor', 'Records air quality measurements', 144),
    (5, 2, 'temperature_sensor', 'Records temperature data', 144),
    (6, 2, 'humidity_sensor', 'Records humidity levels', 144),
    
    -- Urban Mobility Study tables
    (7, 3, 'location_sensor', 'Records GPS coordinates', 1440),
    (8, 3, 'transport_mode_sensor', 'Records transportation methods', 100),
    (9, 3, 'traffic_sensor', 'Records traffic conditions', 144);

-- Insert sensor fields
INSERT INTO campaign_table_field (id, campaign_id, campaign_table_id, name, description, field_type, field_role) 
VALUES 
    -- Health Monitoring Study fields
    -- Activity sensor
    (1, 1, 1, 'user_id', 'Unique identifier for the user', 'numerical', 'uid'),
    (2, 1, 1, 'timestamp', 'Time when the activity was recorded', 'datetime', 'timestamp'),
    (3, 1, 1, 'steps', 'Number of steps taken', 'numerical', 'data'),
    (4, 1, 1, 'activity_type', 'Type of physical activity', 'categorical', 'data'),
    (5, 1, 1, 'calories_burned', 'Calories burned during activity', 'numerical', 'data'),
    
    -- Sleep sensor
    (6, 1, 2, 'user_id', 'Unique identifier for the user', 'numerical', 'uid'),
    (7, 1, 2, 'timestamp', 'Time when sleep data was recorded', 'datetime', 'timestamp'),
    (8, 1, 2, 'sleep_duration', 'Duration of sleep in minutes', 'numerical', 'data'),
    (9, 1, 2, 'sleep_quality', 'Quality of sleep (1-5)', 'categorical', 'data'),
    (10, 1, 2, 'sleep_stage', 'Sleep stage (light, deep, REM)', 'categorical', 'data'),
    
    -- Heart rate sensor
    (11, 1, 3, 'user_id', 'Unique identifier for the user', 'numerical', 'uid'),
    (12, 1, 3, 'timestamp', 'Time when heart rate was measured', 'datetime', 'timestamp'),
    (13, 1, 3, 'heart_rate', 'Heart rate in BPM', 'numerical', 'data'),
    (14, 1, 3, 'activity_level', 'Activity level during measurement', 'categorical', 'data'),
    
    -- Environmental Research fields
    -- Air quality sensor
    (15, 2, 4, 'sensor_id', 'Unique identifier for the sensor', 'numerical', 'uid'),
    (16, 2, 4, 'timestamp', 'Time of measurement', 'datetime', 'timestamp'),
    (17, 2, 4, 'pm2_5', 'PM2.5 concentration', 'numerical', 'data'),
    (18, 2, 4, 'pm10', 'PM10 concentration', 'numerical', 'data'),
    (19, 2, 4, 'co2', 'CO2 concentration', 'numerical', 'data'),
    
    -- Temperature sensor
    (20, 2, 5, 'sensor_id', 'Unique identifier for the sensor', 'numerical', 'uid'),
    (21, 2, 5, 'timestamp', 'Time of measurement', 'datetime', 'timestamp'),
    (22, 2, 5, 'temperature', 'Temperature in Celsius', 'numerical', 'data'),
    (23, 2, 5, 'location', 'Sensor location', 'categorical', 'data'),
    
    -- Humidity sensor
    (24, 2, 6, 'sensor_id', 'Unique identifier for the sensor', 'numerical', 'uid'),
    (25, 2, 6, 'timestamp', 'Time of measurement', 'datetime', 'timestamp'),
    (26, 2, 6, 'humidity', 'Relative humidity percentage', 'numerical', 'data'),
    (27, 2, 6, 'location', 'Sensor location', 'categorical', 'data'),
    
    -- Urban Mobility Study fields
    -- Location sensor
    (28, 3, 7, 'user_id', 'Unique identifier for the user', 'numerical', 'uid'),
    (29, 3, 7, 'timestamp', 'Time of location recording', 'datetime', 'timestamp'),
    (30, 3, 7, 'latitude', 'GPS latitude', 'numerical', 'data'),
    (31, 3, 7, 'longitude', 'GPS longitude', 'numerical', 'data'),
    (32, 3, 7, 'accuracy', 'Location accuracy in meters', 'numerical', 'data'),
    
    -- Transport mode sensor
    (33, 3, 8, 'user_id', 'Unique identifier for the user', 'numerical', 'uid'),
    (34, 3, 8, 'timestamp', 'Time of mode detection', 'datetime', 'timestamp'),
    (35, 3, 8, 'transport_mode', 'Mode of transportation', 'categorical', 'data'),
    (36, 3, 8, 'confidence', 'Detection confidence level', 'numerical', 'data'),
    
    -- Traffic sensor
    (37, 3, 9, 'sensor_id', 'Unique identifier for the sensor', 'numerical', 'uid'),
    (38, 3, 9, 'timestamp', 'Time of measurement', 'datetime', 'timestamp'),
    (39, 3, 9, 'traffic_level', 'Traffic congestion level', 'categorical', 'data'),
    (40, 3, 9, 'vehicle_count', 'Number of vehicles detected', 'numerical', 'data'),
    (41, 3, 9, 'average_speed', 'Average vehicle speed', 'numerical', 'data'); 