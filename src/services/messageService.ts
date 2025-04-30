import { supabase } from '@/lib/supabase';
import { ChatSession, Message } from '@/types/message';
import { Dispatch, SetStateAction } from 'react';

export const getUuidByEmail = async (email: string): Promise<string> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`uuid`)
        .eq('email', email)

    if (error) throw new Error(error.message);
    return data[0].uuid;
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

export const getChatRooms = async (campaignId: number): Promise<ChatSession[]> => {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select()
        .eq('campaign_id', campaignId)

    if (error) throw new Error(error.message);
    return data
}

export const subscribeChatRoomUpdate = async (campaignId: number, patchChatRooms: Dispatch<SetStateAction<ChatSession[]>>): Promise<() => void> => {
    if (!campaignId) return () => { }

    const channel = supabase.realtime.channel('random-channel-name')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `campaign_id=eq.${campaignId}` }, (payload) => {
            console.log(payload)
            // setChatRooms([...payload.new, payload.] as ChatSession[])
        }).subscribe()
    return () => supabase.removeChannel(channel)
}
