import { getChatRooms, getEmailByUuid, subscribeChatRoomUpdate } from "@/services/messageService";
import { ChatSession, ChatSessionWithEmail } from "@/types/message";
import { useCallback, useEffect, useState } from "react";
import useCampaign from "../useCampaign";

export default function useChatRooms() {
    const { selectedCampaignId } = useCampaign();
    const [chatRooms, setChatRooms] = useState<ChatSessionWithEmail[]>([]);

    const patchChatRooms = useCallback((newInfo: ChatSession, eventType: 'UPDATE' | 'INSERT' | 'DELETE') => {
        if (eventType === 'UPDATE') {
            const replaceIndex = chatRooms.findIndex(room => room.id === newInfo.id);
            if (replaceIndex === -1) return;

            const email = chatRooms[replaceIndex].email;
            chatRooms.splice(replaceIndex, 1)
            setChatRooms([{ ...newInfo, email }, ...chatRooms])
        } else if (eventType === 'INSERT') {
            getEmailByUuid(newInfo.uuid).then(email => {
                setChatRooms(prev => [{ ...newInfo, email }, ...prev]);
            })
        }
    }, [chatRooms])

    useEffect(() => {
        async function get() {
            return await getChatRooms(selectedCampaignId!);
        }

        if (selectedCampaignId) {
            get().then(setChatRooms);
        }
    }, [selectedCampaignId]);

    useEffect(() => {
        const unsubscribe = subscribeChatRoomUpdate(selectedCampaignId!, patchChatRooms);
        return unsubscribe;
    }, [selectedCampaignId, patchChatRooms]);

    return { chatRooms };
}
