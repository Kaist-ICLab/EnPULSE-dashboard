CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    campaign_id INTEGER NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE TABLE chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_message TEXT,
    last_message_time DATETIME,
    unread_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    campaign_id INTEGER NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    UNIQUE(user_id) -- 사용자당 하나의 세션만 존재
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
    sender_id INTEGER, -- sender_type이 'user'일 때만 사용
    message_type TEXT NOT NULL CHECK (message_type IN ('chat', 'announcement')),
    title TEXT, -- message_type이 'announcement'일 때만 사용
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);


CREATE TRIGGER update_chat_session_after_insert
AFTER INSERT ON messages
BEGIN
  -- 마지막 메시지/시간 갱신
  UPDATE chat_sessions
  SET last_message = NEW.content,
      last_message_time = NEW.created_at
  WHERE id = NEW.session_id;

  -- 만약 sender가 'user'라면 unread_count 증가
  UPDATE chat_sessions
  SET unread_count = unread_count + 1
  WHERE id = NEW.session_id AND NEW.sender_type = 'user';
END;

-- CREATE TRIGGER reset_unread_after_admin_reads
-- AFTER UPDATE ON messages
-- WHEN NEW.is_read = 1 AND OLD.is_read = 0 AND OLD.sender_type = 'user'
-- BEGIN
--   UPDATE chat_sessions
--   SET unread_count = (
--       SELECT COUNT(*)
--       FROM messages
--       WHERE session_id = NEW.session_id
--         AND sender_type = 'user'
--         AND is_read = 0
--   )
--   WHERE id = NEW.session_id;
-- END;

-- 고려 사항 1: 관리자가 메시지를 조회하면 즉시 읽음 처리되고, unread_count가 줄어야 한다
-- 메세지 조회 시 서버에서 읽음 처리를 해서 업데이트를 보낸다 - WebSocket 사용하여 처리해야됨

