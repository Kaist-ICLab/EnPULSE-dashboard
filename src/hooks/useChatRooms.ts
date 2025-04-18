import { useState, useEffect } from 'react';
import { ChatRoom } from '@/types/message';
import { messages } from './messages';

// Mock data for chat rooms
const mockChatRooms: ChatRoom[] = messages.map(msg => msg.chatRoom);

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const updateReadCount = (chatRoom: ChatRoom) => {
    // Update the selected chat room with unreadCount set to 0
    const updatedChatRoom = {
      ...chatRoom,
      unreadCount: 0,
    };
    setChatRooms(chatRooms.map(room => room.id === updatedChatRoom.id ? updatedChatRoom : room));
  };

  useEffect(() => {
    // Simulate API call with setTimeout
    const fetchChatRooms = async () => {
      try {
        // In the future, this will be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setChatRooms(mockChatRooms);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch chat rooms'));
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return {
    chatRooms,
    loading,
    error,
    updateReadCount,
  };
};

export default useChatRooms;