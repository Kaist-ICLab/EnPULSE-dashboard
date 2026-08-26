import { Message } from "@/types/message";

export default function useSendMessage(_message: Omit<Message, "uuid" | "session_id">) {
  const sendMessageByUuid = async (_uuid: string[], _campaignId: number) => {
  };

  return { sendMessageByUuid };
}
