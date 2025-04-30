import { supabase } from '@/lib/supabase';
import { Campaign, CampaignTable, CampaignTableField } from '@/types/campaign';

export const getCampaigns = async (): Promise<Campaign[]> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`id, name`)
        .order('id')
    if (error) throw new Error(error.message);
    return data as Campaign[];
}

export const updateCampaignName = async (campaignId: number, campaignName: string): Promise<boolean> => {
    const { error } = await supabase
        .from('campaigns')
        .update({ name: campaignName })
        .eq('id', campaignId);

    if (error) throw new Error(error.message);
    return true;
}

export const updateCampaignTable = async (campaignTableId: number, campaignTableDailyCountMax: number): Promise<boolean> => {
    const { error } = await supabase
        .from('campaign_table')
        .update({ daily_count_max: campaignTableDailyCountMax })
        .eq('id', campaignTableId);

    if (error) throw new Error(error.message);
    return true;
}

export const updateCampaignField = async (fieldId: number, changes: Partial<CampaignTableField>): Promise<boolean> => {
    const { error } = await supabase
        .from('campaign_table_field')
        .update(changes)
        .eq('id', fieldId);

    if (error) throw new Error(error.message);
    return true;
}


export const createCampaign = async (campaign: Omit<Campaign, 'id'>): Promise<number> => {
    // TODO: Check auto_increment key. It should be uploadable without id!!
    const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()

    if (error) throw new Error(error.message);
    return data[0].id
    // return true
}

export const getCampaignTables = async (campaignId: number): Promise<CampaignTable[]> => {
    const { data, error } = await supabase
        .from('campaign_table')
        .select(`
            id,
            campaign_id,
            name,
            daily_count_max`)
        .eq('campaign_id', campaignId)
        .order('id', { ascending: true })

    if (error) throw new Error(error.message);
    return data;
}

export const createCampaignTable = async (campainTables: Omit<CampaignTable, 'id'>[]): Promise<number[]> => {
    const promises = campainTables.map(ct => {
        return supabase.from('campaign_table')
            .insert(ct)
            .select()
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
        .map(result => result.value.data?.at(0).id as number);
}

export const getCampaignTableFields = async (campaignId: number, campaignTableId: number): Promise<CampaignTableField[]> => {
    const { data, error } = await supabase
        .from('campaign_table_field')
        .select(`id, campaign_id, campaign_table_id, name, field_type, field_role`)
        .eq('campaign_id', campaignId)
        .eq('campaign_table_id', campaignTableId)
        .order('id', { ascending: true })

    if (error) throw new Error(error.message);
    return data;
}

export const createCampaignTableFields = async (campainTableFields: CampaignTableField[]): Promise<boolean> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promises = campainTableFields.map(({ id, ...others }) => {
        return supabase.from('campaign_table_field')
            .insert(others)
            .select()
    })

    const results = await Promise.allSettled(promises)
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (errors.length > 0) {
        console.error(errors);
        throw new Error(errors.join(', '));
    }

    return true
}

export const updateCampaignTableFields = async (changes: Partial<CampaignTableField>[]): Promise<boolean> => {
    const promises = changes.map(({ id, ...change }) => {
        console.log({ id, ...change })
        supabase.from('campaign_table_field').update(
            change
        ).eq('id', id)
    })
    const results = await Promise.allSettled(promises);
    console.log(results)
    // error만 모으기
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (errors.length > 0) {
        console.error(errors);
        throw new Error(errors.join(', '));
    }

    return true;
}

export const checkCampaignNameValidity = async (campaignName: string): Promise<boolean> => {
    console.log(campaignName)
    if (campaignName == '') return false

    const { data, error } = await supabase
        .from('campaigns')
        .select('id')
        .eq('name', campaignName);

    if (error) throw new Error(error.message);
    if (data && data.length > 0) return false
    return true
}
