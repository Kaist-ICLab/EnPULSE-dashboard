export type Sender = 'user' | 'admin'
export type MessageType = 'chat' | 'announcement'

export interface Message {
    session_id: number,
    sender_type: Sender,
    uuid: string,
    message_type: MessageType,
    title?: string,
    content: string,
}

export interface ChatSession {
    uuid: string,
    campaign_id: number,
    last_message: string,
    last_message_time: number,
    unread_count: number,
}
