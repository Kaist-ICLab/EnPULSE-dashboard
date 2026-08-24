// import { getAnnouncement, getMessages, subscribeMessageUpdate } from '@/services/messageService';
import { Message } from "@/types/message";
import { useEffect, useState, useCallback } from "react";

export const useConversation = (sessionId: number | null) => {
  const [conversation, setConversation] = useState<Message[] | null>(null);
  const [announcement, setAnnouncement] = useState<Message | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);

  const loading = true;
  const error = null;

  const patchMessages = useCallback(
    (newInfo: Message) => {
      if (!conversation) return;
      setConversation([...conversation, newInfo]);
      if (newInfo.message_type == "announcement") setAnnouncement(newInfo);
    },
    [conversation],
  );

  useEffect(() => {
    // async function loadConversation() {
    //     if (!sessionId) return
    //     try {
    //         const messages = await getMessages(sessionId)
    //         const announcement = await getAnnouncement(sessionId)
    //         setAnnouncement(announcement)
    //         setConversation(messages)
    //     } catch {
    //         setError(new Error())
    //     }
    //     setLoading(false)
    // }
    // if (!sessionId) {
    //     setConversation(null);
    //     setAnnouncement(null);
    //     setLoading(false)
    //     return;
    // }
    // setLoading(true);
    // setError(null);
    // loadConversation()
  }, [sessionId]);

  useEffect(() => {
    // if (!sessionId) return;
    // const unsubscribe = subscribeMessageUpdate(sessionId, patchMessages);
    // return () => unsubscribe();
  }, [sessionId, patchMessages]);

  return {
    announcement,
    conversation,
    loading,
    error,
  };
};

export default useConversation;
