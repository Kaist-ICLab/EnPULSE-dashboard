import useSendMessage from "@/hooks/messaging/useSendMessage";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { CampaignParticipant } from "@/types/campaign";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import EmailAutocompleteInput from "./EmailAutocompleteInput";

const SendMessageFloatingModal: React.FC<{
  initialSendTo: CampaignParticipant[];
  onClose: () => void;
}> = ({ initialSendTo = [], onClose }) => {
  const { selectedCampaignId } = useCampaignStore((state) => state);
  const [sendTo, setSendTo] = useState(initialSendTo);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [messageType, setMessageType] = useState<"chat" | "announcement">("chat");
  const { sendMessageByUuid } = useSendMessage({ title, content, message_type: messageType, sender_type: "admin" });

  return (
    <div className="fixed right-6 bottom-6 flex h-[500px] w-full flex-col rounded-t-lg border border-gray-200 bg-white shadow-lg sm:w-[500px]">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 p-3">
        <h3 className="font-semibold">New Message</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <span className="icon-[humbleicons--times] h-5 w-5 cursor-pointer"></span>
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4">
          <EmailAutocompleteInput sendTo={sendTo} setSendTo={setSendTo} />
        </div>
        {messageType === "announcement" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              className="w-full rounded-md border border-gray-300 p-2"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}
        <div className="flex-1">
          <textarea
            placeholder="Message"
            value={content}
            className="h-full w-full resize-none rounded-md border border-gray-300 p-2"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            color={`${messageType === "chat" ? "blue" : "yellow"}`}
            size="md"
            className="flex flex-row gap-1 px-3 text-base"
            onClick={() => setMessageType(messageType === "chat" ? "announcement" : "chat")}
          >
            {messageType === "chat" ? "Chat" : "Announcement"}
          </Button>
          <Button
            color={`${messageType === "chat" ? "blue" : "yellow"}`}
            size="md"
            className="flex flex-row gap-1 px-3 text-base"
            onClick={async () => {
              await sendMessageByUuid(
                sendTo.map((v) => v.uuid),
                selectedCampaignId!,
              );
              onClose();
            }}
          >
            <span className="icon-[material-symbols--send] mt-0.5 h-5 w-5"></span> Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageFloatingModal;
