import { supabase } from '@/lib/supabase';
import { Campaign, CampaignTableField } from '@/types/campaign';

export const getCampaigns = async (): Promise<Campaign[]> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`id, name`);
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


export const createCampaign = async (campaign: Campaign): Promise<boolean> => {
    const { error } = await supabase
        .from('campaigns')
        .insert(campaign);

    if (error) throw new Error(error.message);
    return true;
}

export const getCampaignDetail = async (id: number): Promise<Campaign> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`
      id,
      name,
      campaign_table (
        id,
        name,
        description,
        daily_count_max,
        campaign_table_field (
          id,
          name,
          description,
          data_type,
          column_role
        )
      )
    `)
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}
