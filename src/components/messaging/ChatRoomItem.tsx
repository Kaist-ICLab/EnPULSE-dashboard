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
            className={`w-full rounded-lg p-3 cursor-pointer transition-all ${isSelected ? "bg-blue-200" : "bg-gray-100"}`}
        >
            <div className="flex items-start space-x-4">
                {/* 이니셜 뱃지*/}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {email.slice(0, 3).toUpperCase()}
                </div>

                {/* 이메일 + preview */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate">{email}</div>
                        {unreadCount > 0 && (
                            <div className="flex-shrink-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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