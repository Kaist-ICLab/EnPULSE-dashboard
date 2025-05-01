import { supabase } from '@/lib/supabase';
import { ChatSession, ChatSessionWithEmail, Message } from '@/types/message';

export const getUuidByEmail = async (email: string): Promise<string> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`uuid`)
        .eq('email', email)

    if (error) throw new Error(error.message);
    return data[0].uuid;
}

export const getEmailByUuid = async (uuid: string): Promise<string> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`email`)
        .eq('uuid', uuid)

    if (error) throw new Error(error.message);
    return data[0].email;
}

export const ensureChatSession = async (uuid: string, campaignId: number): Promise<number> => {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select(`id, name`)
        .eq('uuid', uuid)
        .eq('campaign_id', campaignId)
        .select()

    if (error) throw new Error(error.message);
    if (data.length > 0) return data[0].id;

    const { data: newSession, error: newSessionError } = await supabase
        .from('chat_sessions')
        .insert({ uuid, campaign_id: campaignId, last_message: '', last_message_time: new Date().toISOString() })
        .select()

    if (newSessionError) throw new Error(newSessionError.message);
    return newSession[0].id;
}

export const createMessages = async (message: Message): Promise<boolean> => {
    const { error } = await supabase
        .from('messages')
        .insert(message)

    if (error) throw new Error(error.message);
    return true
}

export const getChatRooms = async (campaignId: number): Promise<ChatSessionWithEmail[]> => {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, profiles(email)')
        .eq('campaign_id', campaignId)

    console.log(data)
    if (error) throw new Error(error.message);
    return data.map(({ profiles, ...others }) => ({ ...others, email: profiles.email }))
}

export const subscribeChatRoomUpdate = (campaignId: number, patchChatRooms: (newInfo: ChatSession, eventType: 'UPDATE' | 'INSERT' | 'DELETE') => void): () => void => {
    if (!campaignId) return () => { }

    const channel = supabase.realtime.channel('random-channel-name')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `campaign_id=eq.${campaignId}` }, (payload) => {
            console.log(payload)
            patchChatRooms(payload.new as ChatSession, payload.eventType)
            // setChatRooms([...payload.new, payload.] as ChatSession[])
        }).subscribe()
    return () => supabase.removeChannel(channel)
}
