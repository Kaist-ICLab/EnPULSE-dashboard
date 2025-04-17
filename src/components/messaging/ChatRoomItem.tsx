
const ChatRoomItem: React.FC<{
    email: string;
    lastMessage: string;
    unreadCount: number;
    isSelected: boolean;
    onClick: () => void;
}> = ({ email, lastMessage, unreadCount, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`rounded-lg p-3 cursor-pointer transition-all ${isSelected ? "bg-blue-200" : "bg-gray-100"}`}
        >
            <div className="flex items-start space-x-4">
                {/* 이니셜 뱃지*/}
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {email.slice(0, 3).toUpperCase()}
                </div>

                {/* 이메일 + preview */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{email}</div>
                        {unreadCount > 0 && (
                            <div className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                                {unreadCount}
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{lastMessage}</div>
                </div>
            </div>
        </div>
    )
}   

export default ChatRoomItem;