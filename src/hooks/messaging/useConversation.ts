import { getMessages, subscribeMessageUpdate } from '@/services/messageService';
import { Message } from '@/types/message';
import { useEffect, useState, useCallback } from 'react';

export const useConversation = (sessionId: number | null) => {
    const [conversation, setConversation] = useState<Message[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const patchMessages = useCallback((newInfo: Message) => {
        if (!conversation) return;
        setConversation([...conversation, newInfo]);
    }, [conversation])

    useEffect(() => {
        if (!sessionId) {
            setConversation(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        getMessages(sessionId).then(setConversation).catch(setError).finally(() => setLoading(false));
    }, [sessionId])

    useEffect(() => {
        if (!sessionId) return;
        const unsubscribe = subscribeMessageUpdate(sessionId, patchMessages);
        return () => unsubscribe();
    }, [sessionId, patchMessages])

    return {
        conversation,
        loading,
        error,
    };
};

export default useConversation;
