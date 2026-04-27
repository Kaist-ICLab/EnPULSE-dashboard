// import { getChatRooms, getEmailByUuid, subscribeChatRoomUpdate } from "@/services/messageService";
// import { ChatSession, ChatSessionWithEmail } from "@/types/message";
// import { useCallback, useEffect, useState } from "react";
// import { useCampaignStore } from "@/providers/CampaignStoreProvider";

// export default function useChatRooms() {
//     const { selectedCampaignId } = useCampaignStore((state) => state);
//     const [chatRooms, setChatRooms] = useState<ChatSessionWithEmail[]>([]);

//     const patchChatRooms = useCallback((newInfo: ChatSession, eventType: 'UPDATE' | 'INSERT' | 'DELETE') => {
//         if (eventType === 'UPDATE') {
//             setChatRooms(prev => {
//                 const replaceIndex = prev.findIndex(room => room.id === newInfo.id);
//                 if (replaceIndex === -1) return prev;
//                 const email = prev[replaceIndex].email;
//                 const newChatRooms = [...prev];
//                 newChatRooms.splice(replaceIndex, 1);
//                 return [{ ...newInfo, email }, ...newChatRooms];
//             });
//         } else if (eventType === 'INSERT') {
//             getEmailByUuid(newInfo.uuid).then(email => {
//                 setChatRooms(prev => {
//                     // Check if the chat room already exists
//                     const exists = prev.some(room => room.id === newInfo.id);
//                     if (exists) return prev;
//                     return [{ ...newInfo, email }, ...prev];
//                 });
//             });
//         }
//     }, []);

//     useEffect(() => {
//         async function get() {
//             return await getChatRooms(selectedCampaignId!);
//         }

//         if (selectedCampaignId) {
//             get().then(setChatRooms);
//         }
//     }, [selectedCampaignId]);

//     useEffect(() => {
//         const unsubscribe = subscribeChatRoomUpdate(selectedCampaignId!, patchChatRooms);
//         return unsubscribe;
//     }, [selectedCampaignId, patchChatRooms]);

//     return { chatRooms };
// }
