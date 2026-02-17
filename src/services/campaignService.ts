import { supabase } from '@/lib/supabase';
import { Campaign, CampaignTable, CampaignTableField, FetchedCampaign, RemovedEntries } from '@/types/campaign';
import { FetchedSurveyQuestion, FetchedSurveyTrigger, Survey, SurveyQuestion, SurveyQuestionTrigger } from '@/types/survey';
import { MakeOptional } from '@/utils/type';

type SingleLevelSurveyQuestion = Omit<FetchedSurveyQuestion, 'survey_question_trigger'> & {
    survey_question_trigger: (Omit<FetchedSurveyTrigger, 'survey_question'> & { survey_question?: SingleLevelSurveyQuestion[] })[];
}

function restoreSurveyHierarchy(surveyQuestion: SingleLevelSurveyQuestion, questionList: SingleLevelSurveyQuestion[]) {
    for (const trigger of surveyQuestion.survey_question_trigger) {
        const childQuestion = questionList.filter(q => q.triggered_by === trigger.id);
        trigger.survey_question = childQuestion

        childQuestion.forEach(q => restoreSurveyHierarchy(q, questionList))
    }
}

function recursivelyFillSurveyId(surveyQuestion: SurveyQuestion[], surveyId: number) {
    if (surveyQuestion.length === 0) return;

    surveyQuestion.forEach(sq => sq.survey_id = surveyId)

    const nextLevelQuestion = surveyQuestion.flatMap(sq => sq.survey_question_trigger.flatMap(st => st.survey_question));
    recursivelyFillSurveyId(nextLevelQuestion, surveyId);
}

export const getCampaignList = async (): Promise<{ id: number, name: string, description: string, start_time: string, end_time: string }[]> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`id, name, description, start_time, end_time`)
        .order('id')
    if (error) throw new Error(error.message);
    return data;
}

export const getCampaignInfo = async (campaignId: number): Promise<FetchedCampaign> => {
    const { data, error } = await supabase
        .from('campaigns')
        .select(`*, profiles(*), survey(*, survey_question(*, survey_question_trigger!survey_question_trigger_question_id_fkey(*), survey_question_option(*))),campaign_table(*, campaign_table_field(*, campaign_table_field_mapping(*)))`)
        .eq('id', campaignId)
        .single()

    if (error) throw new Error(error.message);

    data.survey.forEach(s => {
        const topLevelSurveyQuestion = s.survey_question.filter(sq => sq.triggered_by === null);
        topLevelSurveyQuestion.forEach(sq => restoreSurveyHierarchy(sq, s.survey_question))
        s.survey_question = topLevelSurveyQuestion;
    })

    return data as FetchedCampaign;
}

export const upsertCampaign = async (campaign: Campaign, passwordHash: string | null, insertChildTables: boolean = true): Promise<number> => {
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

    if (passwordHash) {
        const { error: credentialTableError } = await supabase
            .from('campaign_credentials')
            .upsert({
                campaign_id: campaignId,
                password_hash: passwordHash,
            }, { onConflict: 'campaign_id' })

        if (credentialTableError) throw new Error(credentialTableError.message);
    }

    if (insertChildTables && (campaignTable.length > 0 || survey.length > 0)) {
        campaignTable.forEach(ct => { ct.campaign_id = campaignId })
        survey.forEach(s => { s.campaign_id = campaignId })

        await Promise.all([upsertCampaignTable(campaignTable), upsertSurvey(survey)]);
    }

    return data[0].id;
}

export const upsertCampaignTable = async (campaignTable: CampaignTable[], insertChildTables: boolean = true): Promise<void> => {
    if (campaignTable.length === 0) return;
    campaignTable.filter(ct => ct.id === -1).forEach(ct => delete ct.id);

    const insertedCampaignTable: MakeOptional<CampaignTable, 'campaign_table_field'>[] = structuredClone(campaignTable);
    const propagatedCampaignTable: CampaignTable[] = structuredClone(campaignTable);

    insertedCampaignTable.forEach(ct => delete ct.campaign_table_field);

    const { data, error } = await supabase
        .from('campaign_table')
        .upsert(insertedCampaignTable, { defaultToNull: false })
        .select()

    if (error) throw new Error(error.message);
    const insertedId = data.map(d => d.id);

    if (insertChildTables) {
        propagatedCampaignTable.forEach((ct, idx) => { ct.campaign_table_field.forEach(ctf => ctf.campaign_table_id = insertedId[idx]) })
        const campaignTableFields = propagatedCampaignTable.flatMap(ct => ct.campaign_table_field);
        await upsertCampaignTableField(campaignTableFields, insertChildTables);
    }
}

export const upsertCampaignTableField = async (campaignTableField: CampaignTableField[], insertChildTables: boolean = true): Promise<void> => {
    if (campaignTableField.length === 0) return;
    campaignTableField.filter(ctf => ctf.id === -1).forEach(ctf => delete ctf.id);

    const insertedCampaignTableField: MakeOptional<CampaignTableField, 'campaign_table_field_mapping'>[] = structuredClone(campaignTableField);
    const propagatedCampaignTableField: CampaignTableField[] = structuredClone(campaignTableField);

    insertedCampaignTableField.forEach(ctf => delete ctf.campaign_table_field_mapping);

    const { data, error } = await supabase.from('campaign_table_field').upsert(insertedCampaignTableField, { defaultToNull: false }).select()
    if (error) throw new Error(error.message);
    const insertedId = data.map(d => d.id);

    if (insertChildTables) {
        propagatedCampaignTableField.forEach((ctf, idx) => { ctf.campaign_table_field_mapping.forEach(ctfm => ctfm.field_id = insertedId[idx]) })
        const campaignTableFieldMappings = propagatedCampaignTableField.flatMap(ctf => ctf.campaign_table_field_mapping);
        await supabase.from('campaign_table_field_mapping').upsert(campaignTableFieldMappings, { defaultToNull: false }).select()
    }
}

export const upsertSurvey = async (survey: Survey[], insertChildTables: boolean = true): Promise<void> => {
    if (survey.length === 0) return;
    survey.filter(s => s.id === -1).forEach(s => delete s.id);

    const insertedSurvey: MakeOptional<Survey, 'survey_question'>[] = structuredClone(survey);
    const propagatedSurvey: Survey[] = structuredClone(survey);

    insertedSurvey.forEach(s => delete s.survey_question);

    const { data, error } = await supabase.from('survey').upsert(insertedSurvey, { defaultToNull: false }).select()
    if (error) throw new Error(error.message);
    const insertedId = data.map(d => d.id);

    if (insertChildTables) {
        propagatedSurvey.forEach((s, idx) => recursivelyFillSurveyId(s.survey_question, insertedId[idx]))
        const surveyQuestions = propagatedSurvey.flatMap(s => s.survey_question);
        await upsertSurveyQuestion(surveyQuestions, insertChildTables);
    }
}

export const upsertSurveyQuestion = async (surveyQuestion: SurveyQuestion[], insertChildTables: boolean = true): Promise<void> => {
    if (surveyQuestion.length === 0) return;
    surveyQuestion.filter(sq => sq.id === -1).forEach(sq => delete sq.id);

    const insertedSurveyQuestion: MakeOptional<SurveyQuestion, 'survey_question_option' | 'survey_question_trigger'>[] = structuredClone(surveyQuestion);
    const propagatedSurveyQuestion: SurveyQuestion[] = structuredClone(surveyQuestion);

    insertedSurveyQuestion.forEach(sq => { delete sq.survey_question_option; delete sq.survey_question_trigger });

    const { data, error } = await supabase.from('survey_question').upsert(insertedSurveyQuestion, { defaultToNull: false }).select()
    if (error) throw new Error(error.message);
    const insertedId = data.map(d => d.id);

    if (insertChildTables) {
        propagatedSurveyQuestion.forEach((sq, idx) => {
            sq.survey_question_option.forEach(sqo => {
                sqo.question_id = insertedId[idx]
            })
            sq.survey_question_trigger.forEach(st => {
                st.question_id = insertedId[idx]
            })
        })
        const surveyQuestionOptions = propagatedSurveyQuestion.flatMap(sq => sq.survey_question_option);
        const surveyQuestionTriggers = propagatedSurveyQuestion.flatMap(sq => sq.survey_question_trigger);
        await supabase.from('survey_question_option').upsert(surveyQuestionOptions, { defaultToNull: false }).select()
        await upsertSurveyTrigger(surveyQuestionTriggers, insertChildTables);
    }
}

export const upsertSurveyTrigger = async (surveyTrigger: SurveyQuestionTrigger[], insertChildTables: boolean = true): Promise<void> => {
    if (surveyTrigger.length === 0) return;
    surveyTrigger.filter(st => st.id === -1).forEach(st => delete st.id);

    const insertedSurveyTrigger: MakeOptional<SurveyQuestionTrigger, 'survey_question'>[] = structuredClone(surveyTrigger);
    const propagatedSurveyTrigger: SurveyQuestionTrigger[] = structuredClone(surveyTrigger);

    insertedSurveyTrigger.forEach(st => delete st.survey_question);

    const { data, error } = await supabase.from('survey_question_trigger').upsert(insertedSurveyTrigger, { defaultToNull: false }).select()
    if (error) throw new Error(error.message);

    const insertedId = data.map(d => d.id);
    if (insertChildTables) {
        propagatedSurveyTrigger.forEach((st, idx) => { st.survey_question.forEach(sq => sq.triggered_by = insertedId[idx]) })
        const surveyQuestions = propagatedSurveyTrigger.flatMap(st => st.survey_question);
        await upsertSurveyQuestion(surveyQuestions, insertChildTables);
    }
}

export const deleteEntries = async (removedEntries: RemovedEntries): Promise<void> => {
    await supabase.from('campaign_table').delete().in('id', removedEntries.table);
    await supabase.from('campaign_table_field').delete().in('id', removedEntries.field);
    await supabase.from('campaign_table_field_mapping').delete().in('id', removedEntries.mapping);
    await supabase.from('survey').delete().in('id', removedEntries.survey);
    await supabase.from('survey_question').delete().in('id', removedEntries.question);
    await supabase.from('survey_question_option').delete().in('id', removedEntries.option);
    await supabase.from('survey_question_trigger').delete().in('id', removedEntries.trigger);
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