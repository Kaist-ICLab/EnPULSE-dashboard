CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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