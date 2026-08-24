// import { createMessages, ensureChatSession } from "@/services/messageService";
import { Message } from "@/types/message";

export default function useSendMessage(message: Omit<Message, "uuid" | "session_id">) {
  const sendMessageByUuid = async (uuid: string[], campaignId: number) => {
    // const sessionId = await ensureChatSession(uuid, campaignId);
    // await sendMessageBySessionId(uuid, sessionId);
  };

  // const sendMessageBySessionId = async (uuid: string[], sessionId: number[]) => {
  // const messages = uuid.map((uid, idx) => ({
  //     ...message,
  //     session_id: sessionId[idx],
  //     uuid: uid
  // }))
  // await createMessages(messages)
  // }

  return { sendMessageByUuid };
}
