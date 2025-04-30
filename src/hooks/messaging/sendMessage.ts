import { createMessages, ensureChatSession, getUuidByEmail } from "@/services/messageService";
import { Message } from "@/types/message";

export default function useSendMessage(message: Omit<Message, 'uuid' | 'session_id'>) {
    const emailToUuid = async (email: string) => {
        const response = await getUuidByEmail(email);
        return response
    }

    const sendMessageByEmail = async (email: string[], campaignId: number) => {
        const uuid = await emailToUuid(email[0]);
        const sessionId = await ensureChatSession(uuid, campaignId);
        await sendMessageBySessionId(uuid, sessionId);
    }

    const sendMessageBySessionId = async (uuid: string, sessionId: number) => {
        await createMessages({
            ...message,
            session_id: sessionId,
            uuid: uuid
        })
    }

    return { emailToUuid, sendMessageByEmail };
}