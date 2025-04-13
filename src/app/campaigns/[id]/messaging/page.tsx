"use client";
import Card from "@/components/Card";
import { useState } from "react";
import { messages as initialMessages } from "@/hooks/messages";
import { Message } from "@/hooks/message";


const Page = () => {

  const [selectedId, setSelectedId] = useState("p01");
  const [messages, setMessages] = useState<Message[]>(initialMessages as unknown as Message[]);
  const selectedMessage = messages.find((msg) => msg.id === selectedId);


  const getUnreadCount = (msg: {
    conversation: {
      sender: "researcher" | "participant";
      read: boolean;
    }[];
  }) => {
    return msg.conversation.filter(
      (m) => m.sender === "participant" && m.read === false
    ).length;
  };
  
  const handleSelect = (id: string) => {
    setSelectedId(id);
  
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              conversation: msg.conversation.map((m) =>
                m.sender === "participant" ? { ...m, read: true } : m
              )
            }
          : msg
      )
    );
  };
  
  return (

    <div className="w-full h-[calc(100vh-100px)]">

        <div className="flex h-full">
        {/* 왼쪽 패널 */}
        <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 font-semibold text-gray-700">Messages</div>
          <div className="space-y-2 px-4">
            {messages.map((msg) => (
              <div
              key={msg.id}
              onClick={() => handleSelect(msg.id)}
              className={`rounded-lg p-3 cursor-pointer transition-all ${
                selectedId === msg.id ? "bg-blue-200" : "bg-gray-100"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* 이니셜 뱃지*/}
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                  {msg.email.slice(0, 3).toUpperCase()}
                </div>
            
                {/* 이메일 + preview */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{msg.email}</div>
                    {getUnreadCount(msg) > 0 && (
                      <div className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                        {getUnreadCount(msg)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{msg.preview}</div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 패널 */}
        <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col">
          {/* 수신자 정보 */}
          <div className="border-b border-gray-200 p-4 font-medium text-gray-700">
            {selectedMessage?.email}
          </div>

          {/* 메시지 히스토리 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedMessage?.conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "researcher" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`text-sm p-3 rounded-lg max-w-fit ${
                    msg.sender === "researcher"
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
        </div>

      </div>
     

  );
}

export default Page;