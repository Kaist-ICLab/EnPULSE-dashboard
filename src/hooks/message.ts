export type Sender = "researcher" | "participant";

export interface ConversationItem {
  sender: Sender;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  email: string;
  preview: string;
  time: string;
  conversation: ConversationItem[];
}
