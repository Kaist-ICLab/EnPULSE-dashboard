import { Conversation } from "@/types/message";

const ChatRoomDetail: React.FC<{
    conversation: Conversation;
}> = ({ conversation }) => {
    return (
        <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col">
            {/* 수신자 정보 */}
            <div className="border-b border-gray-200 p-4 font-medium text-gray-700">
                {conversation.chatRoom.email}
            </div>

            {/* 메시지 히스토리 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === "researcher" ? "justify-start" : "justify-end"
                            }`}
                    >
                        <div
                            className={`text-sm p-3 rounded-lg max-w-fit ${msg.sender === "researcher"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-gray-800"
                                }`}
                        >
                            {msg.text}
                            <div className="text-[10px] text-gray-500 mt-1 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatRoomDetail;