import { ChatRoom, Conversation } from '@/types/message';
import { useEffect, useState } from 'react';
import { messages } from './messages';

// Convert messages to chat rooms format
const mockChatRooms: ChatRoom[] = messages.map(msg => msg.chatRoom);

// Convert messages to conversations format
const mockConversations: Conversation[] = messages;

export const useConversation = () => {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (!selectedChatRoom) {
          setConversation(null);
          setLoading(false);
          return;
        }

        // Simulate API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const messages = mockConversations.find(msg => msg.chatRoom.id === selectedChatRoom.id)?.conversation || [];
        setConversation({
          chatRoom: selectedChatRoom,
          conversation: messages,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch conversation'));
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [selectedChatRoom]);

  return {
    conversation,
    loading,
    error,
    setSelectedChatRoom,
  };
};

export default useConversation;
