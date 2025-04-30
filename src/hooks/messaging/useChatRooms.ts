import { subscribeChatRoomUpdate } from "@/services/messageService";
import { ChatSession } from "@/types/message";
import { useEffect, useState } from "react";
import useCampaign from "../useCampaign";

export default function useChatRooms() {
    const { selectedCampaignId } = useCampaign();
    const [chatRooms, setChatRooms] = useState<ChatSession[]>([]);

    useEffect(() => { })

    useEffect(() => {
        let unsubscribe: () => void;
        async function setupChatRooms() {
            unsubscribe = await subscribeChatRoomUpdate(selectedCampaignId!, setChatRooms);
        }
        setupChatRooms();
        return () => {
            unsubscribe?.();
        };
    }, [selectedCampaignId]);

    return { chatRooms };
}
