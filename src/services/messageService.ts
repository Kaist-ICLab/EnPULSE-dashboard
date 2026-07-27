// import { supabase } from '@/lib/supabase';
// import { mapQuery } from '@/lib/supabaseHelper';
// import { ChatSession, ChatSessionWithEmail, Message } from '@/types/message';

// export const getEmailByUuid = async (uuid: string): Promise<string> => {
//     const { data, error } = await supabase
//         .from('profiles')
//         .select(`email`)
//         .eq('uuid', uuid)

//     if (error) throw new Error(error.message);
//     return data[0].email;
// }

// export const ensureChatSession = async (uuid: string[], campaignId: number): Promise<number[]> => {
//     const results = await mapQuery(uuid, id => {
//         return supabase.from('chat_sessions')
//             .select(`id`)
//             .eq('uuid', id)
//             .eq('campaign_id', campaignId)
//     })
//     const existingSession = results.map(result => result?.at(0)?.id as number)

//     const unavailableSession = results.map((result, idx) => ({ idx, result }))
//         .filter(data => !data.result || data.result.length == 0)
//         .map(data => ({ uuid: uuid[data.idx], campaign_id: campaignId, last_message: '', last_message_time: new Date().toISOString() }))

//     const newSessions = await mapQuery(unavailableSession, session => {
//         return supabase.from('chat_sessions')
//             .insert(session)
//             .select(`id, uuid`)
//     }).then(l => l.map(v => v?.at(0)))

//     const sessions = uuid.map((id, idx) => {
//         return existingSession[idx] ?? newSessions.find(v => v?.uuid == id).id
//     })

//     return sessions
// }

// export const createMessages = async (message: Message[]): Promise<boolean> => {
//     console.log(message)
//     await mapQuery(message, m => {
//         return supabase
//             .from('messages')
//             .insert(m)
//     })

//     return true
// }

// export const getChatRooms = async (campaignId: number): Promise<ChatSessionWithEmail[]> => {
//     const { data, error } = await supabase
//         .from('chat_sessions')
//         .select('*, profiles(email)')
//         .eq('campaign_id', campaignId)
//         .order('last_message_time', { ascending: false })

//     if (error) throw new Error(error.message);
//     return data.map(({ profiles, ...others }) => ({ ...others, email: profiles.email }))
// }

// export const subscribeChatRoomUpdate = (campaignId: number, patchChatRooms: (newInfo: ChatSession, eventType: 'UPDATE' | 'INSERT' | 'DELETE') => void): () => void => {
//     if (!campaignId) return () => { }

//     const channel = supabase.realtime.channel('chatroom-channel')
//         .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `campaign_id=eq.${campaignId}` }, (payload) => {
//             patchChatRooms(payload.new as ChatSession, payload.eventType)
//         }).subscribe()
//     return () => supabase.removeChannel(channel)
// }

// export const getMessages = async (sessionId: number): Promise<Message[]> => {
//     const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .eq('session_id', sessionId)
//         .order('id', { ascending: true })

//     if (error) throw new Error(error.message);
//     return data;
// }

// export const getAnnouncement = async (sessionId: number): Promise<Message> => {
//     const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .eq('session_id', sessionId)
//         .eq('message_type', 'announcement')
//         .order('id', { ascending: false })
//         .limit(1)

//     if (error) throw new Error(error.message);
//     return data[0];
// }

// export const subscribeMessageUpdate = (sessionId: number, patchMessages: (newInfo: Message) => void): () => void => {
//     if (!sessionId) return () => { }

//     const channel = supabase.realtime.channel('message-channel')
//         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
//             patchMessages(payload.new as Message)
//         }).subscribe()
//     return () => supabase.removeChannel(channel)
// }

