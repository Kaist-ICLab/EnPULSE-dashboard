import { supabase } from '@/lib/supabase';
import { Campaign, CampaignTable, CampaignTableField } from '@/types/campaign';
import { Survey, SurveyQuestion } from '@/types/survey';
import { DeepRequired, MakeOptional } from '@/utils/type';

export const getCampaignList = async (): Promise<{ id: number, name: string }[]> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`id, name`)
        .order('id')
    if (error) throw new Error(error.message);
    return data;
}

export const getCampaignInfo = async (campaignId: number): Promise<DeepRequired<Campaign>> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`*, profiles(*), survey(*, survey_question(*, survey_question_option(*))),campaign_table(*, campaign_table_field(*, campaign_table_field_mapping(*)))`)
        .eq('id', campaignId)
        .single()

    if (error) throw new Error(error.message);
    return data as DeepRequired<Campaign>;
}

export const upsertCampaign = async (campaign: Campaign, insertChildTables: boolean = true): Promise<number> => {
    if (campaign.id === -1) delete campaign.id;

    const campaignTable = structuredClone(campaign.campaign_table);
    const survey = structuredClone(campaign.survey);

    const insertedCampaign: MakeOptional<Campaign, 'campaign_table' | 'survey' | 'profiles'> = structuredClone(campaign);
    delete insertedCampaign.campaign_table;
    delete insertedCampaign.survey;
    delete insertedCampaign.profiles;

    const { data, error } = await supabase
        .from('campaigns')
        .upsert(insertedCampaign)
        .select()

    if (error) throw new Error(error.message);
    const campaignId = data[0].id;

    if (insertChildTables) {
        const campaignTablePromises = campaignTable.map((ct) => {
            ct.campaign_id = campaignId;
            upsertCampaignTable(ct, insertChildTables);
        })
        const surveyPromises = survey.map((s) => {
            s.campaign_id = campaignId;
            upsertSurvey(s)
        })

        await Promise.all(campaignTablePromises);
        await Promise.all(surveyPromises);
    }

    return data[0].id;
}

export const upsertCampaignTable = async (campaignTable: CampaignTable, insertChildTables: boolean = true): Promise<void> => {
    if (campaignTable.id === -1) delete campaignTable.id

    const campaignTableFields = structuredClone(campaignTable.campaign_table_field);

    const insertedTable: MakeOptional<CampaignTable, 'campaign_table_field'> = structuredClone(campaignTable);
    delete insertedTable.campaign_table_field;

    const { data, error } = await supabase
        .from('campaign_table')
        .upsert(insertedTable)
        .select()

    if (error) throw new Error(error.message);
    const insertedTableId = data[0].id;

    if (insertChildTables) {
        const campaignTableFieldsPromises = campaignTableFields.map((ctf) => {
            ctf.campaign_table_id = insertedTableId;
            upsertCampaignTableField(ctf, insertChildTables);
        })

        await Promise.all(campaignTableFieldsPromises);
    }
}

export const upsertCampaignTableField = async (campaignTableField: CampaignTableField, insertChildTables: boolean = true): Promise<void> => {
    if (campaignTableField.id === -1) delete campaignTableField.id

    const insertedField: MakeOptional<CampaignTableField, 'campaign_table_field_mapping'> = structuredClone(campaignTableField);
    delete insertedField.campaign_table_field_mapping;

    const { data, error } = await supabase
        .from('campaign_table_field')
        .upsert(insertedField)
        .select()

    if (error) throw new Error(error.message);
    const insertedFieldId = data[0].id;

    // TODO: fix field mapping being not inserted
    if (insertChildTables) {
        campaignTableField.campaign_table_field_mapping.forEach((c) => {
            if (c.id === -1) delete c.id;
            c.field_id = insertedFieldId;
        })

        await supabase.from('campaign_table_field_mapping').upsert(campaignTableField.campaign_table_field_mapping)
    }
}

export const upsertSurvey = async (survey: Survey, insertChildTables: boolean = true): Promise<void> => {
    if (survey.id === -1) delete survey.id

    const surveyQuestions = structuredClone(survey.survey_question);

    const insertedSurvey: MakeOptional<Survey, 'survey_question'> = structuredClone(survey);
    delete insertedSurvey.survey_question;

    const { data, error } = await supabase
        .from('survey')
        .upsert(insertedSurvey)
        .select()

    if (error) throw new Error(error.message);
    const insertedSurveyId = data[0].id;

    if (insertChildTables) {
        const surveyQuestionsPromises = surveyQuestions.map((sq) => {
            sq.survey_id = insertedSurveyId;
            upsertSurveyQuestion(sq, insertChildTables);
        })

        await Promise.all(surveyQuestionsPromises);
    }
}

export const upsertSurveyQuestion = async (surveyQuestion: SurveyQuestion, insertChildTables: boolean = true): Promise<void> => {
    if (surveyQuestion.id === -1) delete surveyQuestion.id

    const surveyQuestionOptions = structuredClone(surveyQuestion.survey_question_option);

    const insertedQuestion: MakeOptional<SurveyQuestion, 'survey_question_option'> = structuredClone(surveyQuestion);
    delete insertedQuestion.survey_question_option;

    const { data, error } = await supabase
        .from('survey_question')
        .upsert(insertedQuestion)
        .select()

    if (error) throw new Error(error.message);
    const insertedQuestionId = data[0].id;

    if (insertChildTables) {
        const surveyQuestionOptionsPromises = surveyQuestionOptions.map((sqo) => {
            sqo.question_id = insertedQuestionId;
            if (sqo.id === -1) delete sqo.id;

            sqo.question_id = insertedQuestionId;
            return supabase.from('survey_question_option')
                .upsert(sqo)
        })

        await Promise.all(surveyQuestionOptionsPromises);
    }
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