'use client'

import { Message } from "@/types/message";
import { Card } from "flowbite-react";
import { useEffect, useRef } from "react";

const ChatRoomDetail: React.FC<{
    announcement: Message | null,
    conversation: Message[];
    receiverEmail: string;
}> = ({ announcement, receiverEmail, conversation }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation]);

    return (
        <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col h-full">
            {/* 수신자 정보 */}
            <div className="border-b border-gray-200 p-4 font-medium text-gray-700">
                {receiverEmail}
            </div>

            {/* 메시지 히스토리 */}
            <div className="flex-1 overflow-y-scroll" ref={scrollRef}>
                {announcement && <div className="sticky top-2.5">
                    <Card className="mx-2.5 py-0">
                        <div className="w-full flex gap-4">
                            <div className="flex justify-center items-center">
                                <span className="icon-[mingcute--announcement-line] w-8 h-8"></span>
                            </div>
                            <div>
                                <div className="text-lg font-bold">{announcement.title}</div>
                                <div>{announcement.content}</div>
                            </div>
                        </div>
                    </Card>
                </div>}
                <div>
                    <div className="h-full p-4 space-y-4 pb-12 pt-6">
                        {conversation.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender_type === "user" ? "justify-start" : "justify-end"
                                    }`}
                            >
                                <div
                                    className={`text-sm p-3 rounded-lg max-w-fit text-gray-800 ${msg.sender_type === "user"
                                        ? "bg-gray-100 "
                                        : (msg.message_type === 'chat' ? "bg-blue-100" : "bg-yellow-100")
                                        }`}
                                >
                                    {msg.message_type === 'chat' ? msg.content : <div className="flex gap-4">
                                        <div className="flex items-center"><span className="icon-[mingcute--announcement-line] w-6 h-6"></span></div>
                                        <div className="grow">
                                            <div className="font-semibold">{msg.title}</div>
                                            <div>{msg.content}</div>
                                        </div>

                                    </div>}
                                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                                        {new Date(msg.created_at || '').toLocaleTimeString("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="h-20"></div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatRoomDetail;