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
      className={`w-full cursor-pointer rounded-lg p-3 transition-all ${isSelected ? "bg-blue-200" : "bg-gray-100"}`}
    >
      <div className="flex items-start space-x-4">
        {/* 이니셜 뱃지*/}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
          {email.slice(0, 3).toUpperCase()}
        </div>

        {/* 이메일 + preview */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium">{email}</div>
            {unreadCount > 0 && (
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </div>
            )}
          </div>
          <div className="truncate text-xs text-gray-500">{lastMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomItem;
