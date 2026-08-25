"use client";

import { Message } from "@/types/message";
import { Card } from "flowbite-react";
import { useEffect, useRef } from "react";

const ChatRoomDetail: React.FC<{
  announcement: Message | null;
  conversation: Message[];
}> = ({ announcement, conversation }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex-1 overflow-y-scroll" ref={scrollRef}>
      {announcement && (
        <div className="sticky top-2.5 z-10">
          <Card className="mx-2.5 py-0">
            <div className="flex w-full gap-4">
              <div className="flex items-center justify-center">
                <span className="icon-[mingcute--announcement-line] h-8 w-8"></span>
              </div>
              <div>
                <div className="text-lg font-bold">{announcement.title}</div>
                <div>{announcement.content}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
      <div className="space-y-4 p-4 pt-6 pb-12">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender_type === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-fit rounded-lg p-3 text-sm text-gray-800 ${
                msg.sender_type === "user"
                  ? "bg-gray-100"
                  : msg.message_type === "chat"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
              }`}
            >
              {msg.message_type === "chat" ? (
                msg.content
              ) : (
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <span className="icon-[mingcute--announcement-line] h-6 w-6"></span>
                  </div>
                  <div className="grow">
                    <div className="font-semibold">{msg.title}</div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              )}
              <div className="mt-1 text-right text-[10px] text-gray-500">
                {new Date(msg.created_at || "").toLocaleTimeString("ko-KR", {
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
  );
};

export default ChatRoomDetail;
