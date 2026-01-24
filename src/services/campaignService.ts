import { supabase } from '@/lib/supabase';
import { Campaign, CampaignTable, CampaignTableField } from '@/types/campaign';

export const getCampaignList = async (): Promise<{ id: number, name: string }[]> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`id, name`)
        .order('id')
    if (error) throw new Error(error.message);
    return data as Campaign[];
}

export const getCampaignInfo = async (campaignId: number): Promise<Campaign> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`*, profiles(*), campaign_table(*, campaign_table_field(*, campaign_table_field_mapping(*)))`)
        .eq('id', campaignId)
        .single()

    if (error) throw new Error(error.message);
    return data;
}

export const upsertCampaign = async (campaign: Campaign): Promise<number> => {
    const { data, error } = await supabase
        .from('campaigns')
        .upsert(campaign)
        .select()

    if (error) throw new Error(error.message);
    return data[0].id;
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
    const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()

    if (error) throw new Error(error.message);
    return data[0].id
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
        .map(result => result.value.data?.at(0)?.id as number);
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
        if (!id) throw new Error('Field id is required');
        return supabase.from('campaign_table_field').update(
            change
        ).eq('id', id)
    })
    const results = await Promise.allSettled(promises);
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
    if (campaignName == '') return false

    const { data, error } = await supabase
        .from('campaigns')
        .select('id')
        .eq('name', campaignName);

    if (error) throw new Error(error.message);
    if (data && data.length > 0) return false
    return true
}