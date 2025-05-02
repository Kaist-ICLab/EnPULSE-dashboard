"use client";

import ChatRoomDetail from "@/components/messaging/ChatRoomDetail";
import ChatRoomItem from "@/components/messaging/ChatRoomItem";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import useChatRooms from "@/hooks/messaging/useChatRooms";
import useConversation from "@/hooks/messaging/useConversation";
import { Button, Spinner } from "flowbite-react";
import { useState } from "react";

const Page = () => {
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const { chatRooms } = useChatRooms();
    const { announcement, conversation, loading, error } = useConversation(selectedSessionId);
    const [showCompose, setShowCompose] = useState(false);

    return (
        <div className="w-full h-full">
            <div className="flex flex-col h-full">
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
                    <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col h-full">
                        {/* 수신자 정보 */}
                        <div className="h-16 flex items-center border-b border-gray-200 px-4 font-medium text-gray-700">
                            {chatRooms?.find(v => v.id === selectedSessionId)?.email || ''}
                            <Button className="ml-auto" onClick={() => setShowCompose(true)}>
                                Send Message
                            </Button>
                        </div>
                        {loading ? <div className="flex flex-1 overflow-y-scroll justify-center items-center"><Spinner className="w-16 h-16" size="xl" /></div> : conversation && (
                            <ChatRoomDetail
                                announcement={announcement}
                                conversation={conversation}
                            />
                        )}
                    </div>
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