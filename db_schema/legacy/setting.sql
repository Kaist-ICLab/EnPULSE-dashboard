CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- db_type TEXT NOT NULL CHECK (db_type IN ('URL', 'FILE')),
-- db_url TEXT,

-- Campaign에서 수집하는 데이터 테이블들 관리
CREATE TABLE campaign_table (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    name TEXT NOT NULL, -- 수집하는 데이터 테이블 이름
    description TEXT, -- 수집하는 데이터 테이블 설명
    daily_count_max INTEGER NOT NULL, -- 수집 데이터 시각화를 위한 Threshold 값
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE TABLE campaign_table_field (
    id SERIAL PRIMARY KEY,
    campaign_table_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    data_type TEXT NOT NULL CHECK (
        data_type IN ('categorical', 'numerical', 'timedelta', 'datetime')
    ),
    column_role TEXT NOT NULL CHECK (
        column_role IN ('uid', 'timestamp', 'data', 'ignore')
    ),
    FOREIGN KEY (campaign_table_id) REFERENCES campaign_table(id)
);

-- 고려 사항 1: Campaign_table에서 수집하는 데이터 테이블 이름을 통해서 수집하는 데이터 테이블 정보를 가져와야 함


CREATE TABLE campaign_table_user_daily_summary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    campaign_table_id INTEGER NOT NULL,
    daily_count INTEGER NOT NULL,
    hourly_count_0 INTEGER NOT NULL,
    hourly_count_1 INTEGER NOT NULL,
    hourly_count_2 INTEGER NOT NULL,
    hourly_count_3 INTEGER NOT NULL,
    hourly_count_4 INTEGER NOT NULL,
    hourly_count_5 INTEGER NOT NULL,
    hourly_count_6 INTEGER NOT NULL,
    hourly_count_7 INTEGER NOT NULL,
    FOREIGN KEY (campaign_table_id) REFERENCES campaign_table(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
