import { supabase } from '@/lib/supabase';
// import { mapQuery } from '@/lib/supabaseHelper';

export async function getCampaignDailySummary(campaignId: number, page: number, pageCount: number) {
    const from = (page - 1) * pageCount;
    const to = from + pageCount - 1;

    const { data, error } = await supabase
        .from(`profiles`)
        .select(`uuid, email, campaign_table_user_daily_summary(*), messages(count)`)
        .eq('campaign_id', campaignId)
        .range(from, to)

    if (error) throw new Error(error.message);

    console.log(data)
    return data.map(v => ({
        email: v.email,
        uuid: v.uuid,
        contacts: v.messages[0].count,
        columns: Array.from({ length: 8 }).map((_, idx) => v.campaign_table_user_daily_summary)
    }))

    // const uuid = profiles.map(v => v.uuid as string)
    // const dataCounts = await mapQuery(uuid, uid => {
    //     return supabase
    //         .from(`campaign_table_user_daily_summary`)
    //         .select(`*`)
    //         .eq('uuid', uid)
    // })

    // const contacts = await mapQuery(uuid, uid => {
    //     return supabase
    //         .from('messages')
    //         // .select('content')
    //         .select('*', { count: 'exact', head: true })
    //         .eq('uuid', uid)
    // }, true)

    // console.log(contacts)

    // const results = uuid.map((_, i) => ({
    //     columns: [...dataCounts[i]], contacts: contacts[i], profiles:
    // }))

    // return results
}