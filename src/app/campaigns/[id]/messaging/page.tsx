"use client";

import ChatRoomDetail from "@/components/messaging/ChatRoomDetail";
import ChatRoomItem from "@/components/messaging/ChatRoomItem";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import useChatRooms from "@/hooks/messaging/useChatRooms";
import useConversation from "@/hooks/messaging/useConversation";
import { Spinner } from "flowbite-react";
import { useState } from "react";

const Page = () => {
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const { chatRooms } = useChatRooms();
    const { announcement, conversation, loading, error } = useConversation(selectedSessionId);
    const [showCompose, setShowCompose] = useState(false);

    return (
        <div className="w-full h-full">
            <div className="flex flex-col h-full">
                {/* Header row */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="font-semibold text-gray-700">Messages</div>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => setShowCompose(true)}
                    >
                        Send Message
                    </button>
                </div>

                {/* Chat panel */}
                <div className="flex flex-1 min-h-0">
                    {/* 왼쪽 패널 */}
                    <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-gray-200 overflow-y-auto">
                        <div className="space-y-2 p-4">
                            {chatRooms?.map((chatRoom, i) => (
                                <ChatRoomItem
                                    key={i}
                                    email={chatRoom.email}
                                    lastMessage={chatRoom.last_message}
                                    unreadCount={chatRoom.unread_count}
                                    isSelected={selectedSessionId === chatRoom.id}
                                    onClick={() => {
                                        setSelectedSessionId(chatRoom.id);
                                        // updateReadCount(chatRoom);
                                    }}
                                />))}
                        </div>
                    </div>

                    {loading ? <div className="flex w-full justify-center items-center h-full"><Spinner size="xl" /></div> : conversation && (
                        <ChatRoomDetail
                            receiverEmail={chatRooms?.find(v => v.id === selectedSessionId)?.email || ''}
                            announcement={announcement}
                            conversation={conversation}
                        />
                    )}
                </div>
            </div>
            {showCompose && (
                <SendMessageFloatingModal
                    initialSendTo={chatRooms?.find(v => v.id === selectedSessionId)?.email || ''}
                    onClose={() => setShowCompose(false)}
                />
            )}
        </div>
    );
}

export default Page;