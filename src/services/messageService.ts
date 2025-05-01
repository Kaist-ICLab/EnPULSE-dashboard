import { supabase } from '@/lib/supabase';
import { ChatSession, ChatSessionWithEmail, Message } from '@/types/message';

export const getUuidByEmail = async (email: string[]): Promise<string[]> => {
    const promises = email.map(e => {
        return supabase.from('profiles')
            .select(`uuid`)
            .eq('email', e)
    })

    const results = await Promise.allSettled(promises)
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (errors.length > 0) {
        console.error(errors);
        throw new Error(errors.join(', '));
    }

    return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.data?.at(0)?.uuid as string);
}

export const getEmailByUuid = async (uuid: string): Promise<string> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`email`)
        .eq('uuid', uuid)

    if (error) throw new Error(error.message);
    return data[0].email;
}

export const ensureChatSession = async (uuid: string[], campaignId: number): Promise<number> => {
    const checkSession = uuid.map(id => {
        return supabase.from('chat_sessions')
            .select(`id, name`)
            .eq('uuid', id)
            .eq('campaign_id', campaignId)
    })

    const res = supabase.from('chat_sessions')
        .select(`id, name`)
        .eq('uuid', id)
        .eq('campaign_id', campaignId)

    const res2 = supabase.from('chat_sessions')
        .update({})

    const results = await Promise.allSettled(checkSession)
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (errors.length > 0) {
        console.error(errors);
        throw new Error(errors.join(', '));
    }

    const generateSession = results.filter(result => result.status === 'fulfilled')
        .map(results => results.value.data)
        .filter(results => results && results.length > 0)
        .map(data => {
            return supabase
                .from('chat_sessions')
                .insert({ data.uuid, campaign_id: campaignId, last_message: '', last_message_time: new Date().toISOString() })
                .select()
        })

    if (error) throw new Error(error.message);
    if (data.length > 0) return data[0].id;

    const { data: newSession, error: newSessionError } = await 

    if (newSessionError) throw new Error(newSessionError.message);
    return newSession[0].id;
}

export const createMessages = async (message: Message): Promise<boolean> => {
    const { error } = await supabase
        .from('messages')
        .insert(message)

    if (error) throw new Error(error.message);

    const { error: error2 } = await supabase
        .from('chat_sessions')
        .update({ unread_count: 0 })
        .eq('id', message.session_id)

    if (error2) throw new Error(error2.message);

    return true
}

export const getChatRooms = async (campaignId: number): Promise<ChatSessionWithEmail[]> => {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, profiles(email)')
        .eq('campaign_id', campaignId)
        .order('last_message_time', { ascending: false })

    console.log(data)
    if (error) throw new Error(error.message);
    return data.map(({ profiles, ...others }) => ({ ...others, email: profiles.email }))
}

export const subscribeChatRoomUpdate = (campaignId: number, patchChatRooms: (newInfo: ChatSession, eventType: 'UPDATE' | 'INSERT' | 'DELETE') => void): () => void => {
    if (!campaignId) return () => { }

    const channel = supabase.realtime.channel('chatroom-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `campaign_id=eq.${campaignId}` }, (payload) => {
            patchChatRooms(payload.new as ChatSession, payload.eventType)
        }).subscribe()
    return () => supabase.removeChannel(channel)
}

export const getMessages = async (sessionId: number): Promise<Message[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: true })

    if (error) throw new Error(error.message);
    return data;
}

export const getAnnouncement = async (sessionId: number): Promise<Message> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('message_type', 'announcement')
        .order('id', { ascending: false })
        .limit(1)

    if (error) throw new Error(error.message);
    return data[0];
}

export const subscribeMessageUpdate = (sessionId: number, patchMessages: (newInfo: Message) => void): () => void => {
    if (!sessionId) return () => { }

    const channel = supabase.realtime.channel('message-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
            patchMessages(payload.new as Message)
        }).subscribe()
    return () => supabase.removeChannel(channel)
}

