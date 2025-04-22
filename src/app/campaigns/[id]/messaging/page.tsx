"use client";

import ChatRoomDetail from "@/components/messaging/ChatRoomDetail";
import ChatRoomItem from "@/components/messaging/ChatRoomItem";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import useChatRooms from "@/hooks/useChatRooms";
import useConversation from "@/hooks/useConversation";
import { useState } from "react";

const Page = () => {
    const { conversation, setSelectedChatRoom } = useConversation();
    const { chatRooms, updateReadCount } = useChatRooms();
    const [showCompose, setShowCompose] = useState(false);

    const handleSendMessage = () => {
        // TODO: Implement send message logic here
        console.log('Sending message...');
        setShowCompose(false);
    };

    return (
        <div className="w-full h-[calc(100vh-100px)]">
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
                        <div className="space-y-2 px-4">
                            {chatRooms?.map((chatRoom) => (
                                <ChatRoomItem
                                    key={chatRoom.id}
                                    email={chatRoom.email}
                                    lastMessage={chatRoom.lastMessage}
                                    unreadCount={chatRoom.unreadCount}
                                    isSelected={conversation?.chatRoom.id === chatRoom.id}
                                    onClick={() => {
                                        setSelectedChatRoom(chatRoom);
                                        updateReadCount(chatRoom);
                                    }}
                                />))}
                        </div>
                    </div>

                    {conversation && (
                        <ChatRoomDetail
                            conversation={conversation}
                        />
                    )}
                </div>
            </div>
            {showCompose && (
                <SendMessageFloatingModal
                    sendTo={conversation?.chatRoom.email || ''}
                    onClose={() => setShowCompose(false)}
                    onSendButtonClick={handleSendMessage}
                />
            )}
        </div>
    );
}

export default Page;