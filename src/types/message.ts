export type Sender = "researcher" | "participant";

export interface Message {
  sender: Sender;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  email: string;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
}

export interface Conversation {
  chatRoom: ChatRoom;
  conversation: Message[];
}
