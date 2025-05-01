import { createMessages, ensureChatSession, getUuidByEmail } from "@/services/messageService";
import { Message } from "@/types/message";

export default function useSendMessage(message: Omit<Message, 'uuid' | 'session_id'>) {
    const emailToUuid = async (email: string[]) => {
        const response = await getUuidByEmail(email);
        return response
    }

    const sendMessageByEmail = async (email: string[], campaignId: number) => {
        const uuid = await emailToUuid(email);
        const sessionId = await ensureChatSession(uuid, campaignId);
        console.log(sessionId)
        await sendMessageBySessionId(uuid, sessionId);
    }

    const sendMessageBySessionId = async (uuid: string[], sessionId: number[]) => {
        const messages = uuid.map((uid, idx) => ({
            ...message,
            session_id: sessionId[idx],
            uuid: uid
        }))
        await createMessages(messages)
    }

    return { emailToUuid, sendMessageByEmail };
}