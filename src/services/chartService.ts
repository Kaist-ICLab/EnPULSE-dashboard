import { supabase } from '@/lib/supabase';
import { BucketCategoricalData, BucketNumericalData, groupByTimestamp, groupByTimestampAndBitmask, mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTable } from '@/types/campaign';
import { ChartType, TimelineData, TimelineSurveyEventPoint } from '@/types/chart';
import dayjs from 'dayjs';
import { DeepRequired } from '@/utils/type';
import { DATE_FORMAT } from '@/utils/date';
import { UserDailyStatData } from '@/types/dashboard';
import { Ok, Err } from '@/utils/type';
import { FetchedSurvey, FetchedSurveyQuestion, OptionQuestionConfig } from '@/types/survey';

export async function getCampaignDailySummary(uuids: string[], tableIds: number[], date: Date) {
    const { data: contactData, error: contactError } = await supabase
        .from('profiles')
        .select('messages(count)')
        .in('uuid', uuids)
        .order('uuid', { ascending: true })

    if (contactError) throw new Error(contactError.message);

    const { data, error } = await supabase
        .from(`campaign_table_row_count`)
        .select('*')
        .in('uuid', uuids)
        .in('table_id', tableIds)
        .eq('day', dayjs(date).format('YYYY-MM-DD'))
        .order('uuid', { ascending: true })
        .order('table_id', { ascending: true })
        .order('time_slot', { ascending: true })

    if (error) throw new Error(error.message);

    if (data.length == 0) return []

    // Aggregate data per profile, with contacts, tables, and time_slots
    const result: UserDailyStatData[] = uuids.map((uuid, idx) => ({
        uuid: uuid,
        contacts: contactData[idx].messages[0].count,
        tables: [],
        surveys: []
    }));

    for (const v of data) {
        // Table aggregation
        const tables = result.find(r => r.uuid === v.uuid)!.tables;
        if (!tables.find(t => t.table_id === v.table_id)) {
            tables.push({
                table_id: v.table_id,
                totalCount: 0,
                counts: []
            });
        }

        const table = tables.find(t => t.table_id === v.table_id)!;
        // Time slot aggregation
        table.totalCount += v.count;
        table.counts.push(v.count);
    }

    return result;
}

// Survey response daily summary — counts distinct (uuid, survey_id, survey_start_time)
// per uuid per survey per 3-hour time slot for the given date.
const SURVEY_TIME_SLOT_COUNT = 8; // 24h / 3h
const SURVEY_TIME_SLOT_MS = (24 * 60 * 60 * 1000) / SURVEY_TIME_SLOT_COUNT;

export async function getCampaignSurveyDailySummary(
    uuids: string[],
    surveyIds: number[],
    date: Date,
): Promise<Map<string, { survey_id: number, totalCount: number, counts: number[] }[]>> {
    const result = new Map<string, { survey_id: number, totalCount: number, counts: number[] }[]>();
    if (uuids.length === 0 || surveyIds.length === 0) return result;

    const dayStart = dayjs(date).startOf('day');
    const dayEnd = dayjs(date).endOf('day');

    const { data, error } = await supabase
        .from('survey_question_response')
        .select('uuid, survey_start_time, survey_question!inner(survey_id)')
        .in('uuid', uuids)
        .in('survey_question.survey_id', surveyIds)
        .gte('survey_start_time', dayStart.format(DATE_FORMAT))
        .lte('survey_start_time', dayEnd.format(DATE_FORMAT));

    if (error) throw new Error(error.message);

    for (const uuid of uuids) {
        result.set(uuid, surveyIds.map(survey_id => ({
            survey_id,
            totalCount: 0,
            counts: Array.from({ length: SURVEY_TIME_SLOT_COUNT }, () => 0),
        })));
    }

    // De-duplicate by (uuid, survey_id, survey_start_time) since one survey
    // submission writes one row per question.
    const seen = new Set<string>();
    for (const row of data ?? []) {
        const surveyId = row.survey_question.survey_id;
        const key = `${row.uuid}|${surveyId}|${row.survey_start_time}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const userSurveys = result.get(row.uuid);
        if (!userSurveys) continue;
        const entry = userSurveys.find(s => s.survey_id === surveyId);
        if (!entry) continue;

        const t = new Date(row.survey_start_time).getTime();
        const slot = Math.min(SURVEY_TIME_SLOT_COUNT - 1, Math.max(0, Math.floor((t - dayStart.valueOf()) / SURVEY_TIME_SLOT_MS)));
        entry.totalCount += 1;
        entry.counts[slot] += 1;
    }

    return result;
}

// --- Survey question response timelines (raw, no aggregation) ---

type FlatSurveyQuestion = FetchedSurveyQuestion & { survey_id: number };

export function flattenSurveyQuestions(surveys: FetchedSurvey[]): Map<number, FlatSurveyQuestion> {
    const map = new Map<number, FlatSurveyQuestion>();
    const walk = (questions: FetchedSurveyQuestion[], surveyId: number) => {
        for (const q of questions) {
            map.set(q.id, { ...q, survey_id: surveyId });
            for (const trigger of q.survey_question_trigger) {
                walk(trigger.survey_question, surveyId);
            }
        }
    };
    for (const s of surveys) {
        walk(s.survey_question, s.id);
    }
    return map;
}

// The Android library wraps responses in a small object (e.g. `{ value: ... }`).
// Peel one level of common wrapper keys so the downstream handlers see the
// primitive/array they expect.
export function unwrapSurveyResponse(response: unknown): unknown {
    if (response === null || response === undefined) return response;
    if (typeof response !== 'object' || Array.isArray(response)) return response;
    const obj = response as Record<string, unknown>;
    for (const key of ['value', 'answer', 'selected', 'selectedValue', 'data', 'response']) {
        if (key in obj) return obj[key];
    }
    return response;
}

// Format a raw response into a human-readable string for tooltip display.
export function formatSurveyResponse(response: unknown, question: FetchedSurveyQuestion): string {
    const v = unwrapSurveyResponse(response);
    switch (question.answer_type) {
        case 'number':
        case 'numberscale': {
            const n = typeof v === 'number' ? v : Number(v);
            return Number.isFinite(n) ? String(n) : String(v ?? '');
        }
        case 'binary': {
            if (typeof v === 'boolean') return v ? 'Yes' : 'No';
            if (v === 0 || v === '0') return 'No';
            if (v === 1 || v === '1') return 'Yes';
            return String(v ?? '');
        }
        case 'radio': {
            const opts = (question.config as OptionQuestionConfig | null)?.options ?? [];
            if (typeof v === 'number' && opts[v] !== undefined) return opts[v];
            if (typeof v === 'string' && opts.includes(v)) return v;
            return String(v ?? '');
        }
        case 'text':
            return String(v ?? '');
        case 'checkbox': {
            const opts = (question.config as OptionQuestionConfig | null)?.options ?? [];
            let indices: number[] = [];
            if (Array.isArray(v)) {
                indices = v.map(item => Number(item)).filter(n => Number.isFinite(n));
            } else if (typeof v === 'number') {
                for (let i = 0; i < 32; i++) if ((v >> i) & 1) indices.push(i);
            }
            const labels = indices.map(i => opts[i] ?? String(i));
            return labels.length === 0 ? '—' : labels.join(', ');
        }
        default:
            return String(v ?? '');
    }
}

type SurveyResponseRow = {
    uuid: string;
    question_id: number;
    response: unknown;
    response_submission_time: string | null;
    actual_trigger_time: string | null;
    trigger_time: string | null;
};

// When the response is null, look at the trigger / submission timestamps to
// distinguish how the survey ended.
function classifyNullResponse(row: SurveyResponseRow): string {
    const triggered = !!row.actual_trigger_time;
    const submitted = !!row.response_submission_time;
    if (!triggered) return '(no response)';
    if (!submitted) return '(expired)';
    return '(dismissed)';
}

function makeEventPoint(
    row: SurveyResponseRow,
    question: FlatSurveyQuestion,
): TimelineSurveyEventPoint {
    const unwrapped = unwrapSurveyResponse(row.response);
    const isNull = unwrapped === null || unwrapped === undefined;
    // Plot at submission time when answered; fall back to actual delivery time
    // (expired) or scheduled trigger time (no response) so the dot still lands
    // somewhere on the timeline.
    const ts = row.response_submission_time || row.actual_trigger_time || row.trigger_time || '';
    return {
        timestamp: new Date(ts).getTime(),
        questionId: question.id,
        questionTitle: question.question,
        answerType: question.answer_type,
        response: isNull ? classifyNullResponse(row) : formatSurveyResponse(row.response, question),
        rawResponse: unwrapped,
    };
}

async function fetchSurveyResponses(
    uuids: string[],
    questionIds: number[],
    startTime: string,
    endTime: string,
): Promise<SurveyResponseRow[]> {
    if (uuids.length === 0 || questionIds.length === 0) return [];
    // Filter on trigger_time (always set) instead of response_submission_time
    // so rows with null/expired responses are still returned.
    const { data, error } = await supabase
        .from('survey_question_response')
        .select('uuid, question_id, response, response_submission_time, actual_trigger_time, trigger_time')
        .in('uuid', uuids)
        .in('question_id', questionIds)
        .gte('trigger_time', startTime)
        .lte('trigger_time', endTime);

    if (error) throw new Error(error.message);
    return (data ?? []) as SurveyResponseRow[];
}

// Used by the distribution modal's "Whole period" mode — same fetch but no
// upper/lower time bounds (caller can supply campaign-wide bounds instead).
export async function getSurveyEventsForWholePeriod(
    uuid: string,
    questionIds: number[],
    questionMap: Map<number, FlatSurveyQuestion>,
    startTime: string,
    endTime: string,
): Promise<TimelineSurveyEventPoint[]> {
    const rows = await fetchSurveyResponses([uuid], questionIds, startTime, endTime);
    const out: TimelineSurveyEventPoint[] = [];
    for (const row of rows) {
        const q = questionMap.get(row.question_id);
        if (!q) continue;
        out.push(makeEventPoint(row, q));
    }
    return out;
}

// All selected questions' responses are merged into ONE TimelineData. The plot
// component lays them out as one row per questionId.
export async function getSurveyQuestionSensorComparisonData(
    date: Date,
    participant: CampaignParticipant | undefined,
    questions: FlatSurveyQuestion[],
    timeRange: { start: number, end: number },
): Promise<TimelineData[]> {
    if (participant === undefined || questions.length === 0) return [];

    const timeGap = timeRange.end - timeRange.start;
    const startTime = dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT);
    const endTime = dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT);
    const questionIds = questions.map(q => q.id);
    const questionMap = new Map(questions.map(q => [q.id, q]));

    const rows = await fetchSurveyResponses([participant.uuid], questionIds, startTime, endTime);

    const value: TimelineSurveyEventPoint[] = [];
    for (const row of rows) {
        const q = questionMap.get(row.question_id);
        if (!q) continue;
        value.push(makeEventPoint(row, q));
    }

    return [{
        id: `survey-events-${participant.uuid}`,
        title: questions.length === 1 ? questions[0].question : `Survey responses (${questions.length} questions)`,
        chartType: 'survey_events' as ChartType,
        params: { date, uuid: participant.uuid, fieldId: -1, questionId: questions[0]?.id },
        value,
    }];
}

export async function getSurveyQuestionPersonComparisonData(
    date: Date,
    participants: CampaignParticipant[],
    question: FlatSurveyQuestion | undefined,
    timeRange: { start: number, end: number },
): Promise<TimelineData[]> {
    if (participants.length === 0 || question === undefined) return [];

    const timeGap = timeRange.end - timeRange.start;
    const startTime = dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT);
    const endTime = dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT);

    const rows = await fetchSurveyResponses(participants.map(p => p.uuid), [question.id], startTime, endTime);

    return participants.map(p => {
        const value: TimelineSurveyEventPoint[] = [];
        for (const row of rows) {
            if (row.uuid !== p.uuid) continue;
            value.push(makeEventPoint(row, question));
        }
        return {
            id: `survey-events-q${question.id}-${p.uuid}`,
            title: `P${p.pid}`,
            chartType: 'survey_events' as ChartType,
            params: { date, uuid: p.uuid, fieldId: -1, questionId: question.id },
            value,
        };
    });
}

export async function getSurveyQuestionDaysComparisonData(
    date: Date,
    participant: CampaignParticipant | undefined,
    question: FlatSurveyQuestion | undefined,
    timeRange: { start: number, end: number },
): Promise<TimelineData[]> {
    if (participant === undefined || question === undefined) return [];

    const timeGap = timeRange.end - timeRange.start;
    const dates = Array.from({ length: 7 }, (_, i) => dayjs(date).subtract(i, 'day').toDate());

    const perDay = await Promise.all(dates.map(d => fetchSurveyResponses(
        [participant.uuid],
        [question.id],
        dayjs(d).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
        dayjs(d).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
    )));

    return dates.map((d, idx) => {
        const value: TimelineSurveyEventPoint[] = [];
        for (const row of perDay[idx]) {
            value.push(makeEventPoint(row, question));
        }
        return {
            id: `survey-events-q${question.id}-${dayjs(d).format('YYYY-MM-DD')}`,
            title: dayjs(d).format('YYYY-MM-DD'),
            chartType: 'survey_events' as ChartType,
            params: { date: d, uuid: participant.uuid, fieldId: -1, questionId: question.id },
            value,
        };
    });
}

export async function getSensorComparisonData(
    date: Date,
    participant: CampaignParticipant | undefined,
    tables: DeepRequired<CampaignTable>[],
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participant == undefined || tables.length == 0) return [];

    const timeGap = timeRange.end - timeRange.start;
    const uuid = participant.uuid;

    const fields = tables.flatMap(table => table.campaign_table_field).map(field => ({
        ...field,
        table_name: tables.find(t => t.id === field.campaign_table_id)?.name ?? '',
        display_name: tables.find(t => t.id === field.campaign_table_id)?.display_name ?? ''
    })).filter(field => field.table_name !== '')

    const data = await mapQuery(fields, field => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: uuid,
            table_name: field.table_name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (Ok<BucketNumericalData[]> | Ok<BucketCategoricalData[]> | Err<string> | null)[]

    const successfulData = data.filter(d => d?.ok === true).map(d => d?.data);

    return fields.map((field, idx) => {
        if (field.field_type == "categorical" || field.field_type == "text") {
            // Group data by timestamp
            const rawCategoricalData = successfulData[idx] as BucketCategoricalData[] | null;
            const groupedData = groupByTimestamp(rawCategoricalData);

            return {
                title: `${field.display_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: groupedData ?? []
            }

        } else if (field.field_type === "bitmask") {
            const rawCategoricalData = successfulData[idx] as BucketCategoricalData[] | null;
            const groupedData = groupByTimestampAndBitmask(rawCategoricalData);
            return {
                title: `${field.display_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: 'heatmap' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: groupedData ?? []
            };
        } else {
            const numericalData = successfulData[idx] as BucketNumericalData[] | null;
            return {
                title: `${field.display_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: 'numerical' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: numericalData ? numericalData.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) : []
            }
        }
    })
}

export async function getPersonComparisonData(
    date: Date, participants: CampaignParticipant[],
    table: DeepRequired<CampaignTable> | undefined,
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participants.length == 0 || table == undefined) return [];

    const timeGap = timeRange.end - timeRange.start;

    const field = table.campaign_table_field[0]

    const data = await mapQuery(participants, p => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: p.uuid,
            table_name: table.name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (Ok<BucketNumericalData[]> | Ok<BucketCategoricalData[]> | Err<string> | null)[]

    const successfulData = data.filter(d => d?.ok === true).map(d => d?.data);

    if (field.field_type == "categorical" || field.field_type == "text") {
        const rawCategoricalData = successfulData as (BucketCategoricalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: `P${p.pid}`,
                id: p.uuid,
                chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
                params: { date, uuid: p.uuid, fieldId: field.id },
                value: groupByTimestamp(rawCategoricalData[idx])
            }
        ))
    } else if (field.field_type === "bitmask") {
        const rawCategoricalData = successfulData as (BucketCategoricalData[] | null)[];
        return participants.map((p, idx) => ({
            title: `P${p.pid}`,
            id: p.uuid,
            chartType: 'heatmap' as ChartType,
            params: { date, uuid: p.uuid, fieldId: field.id },
            value: groupByTimestampAndBitmask(rawCategoricalData[idx])
        }));
    } else {
        const numericalData = successfulData as (BucketNumericalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: `P${p.pid}`,
                id: p.uuid,
                chartType: "numerical" as ChartType,
                params: { date, uuid: p.uuid, fieldId: field.id },
                value: numericalData[idx]?.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) ?? []
            }
        ))
    }
}

export async function getDaysComparisonData(
    date: Date, participant: CampaignParticipant | undefined,
    table: DeepRequired<CampaignTable> | undefined,
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participant == undefined || table == undefined) return [];
    const timeGap = timeRange.end - timeRange.start;
    const field = table.campaign_table_field[0]
    const uuid = participant.uuid;

    const dates = Array.from({ length: 7 }, (_, i) => dayjs(date).subtract(i, 'day').toDate())

    const data = await mapQuery(dates, d => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(d).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(d).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid,
            table_name: table.name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (Ok<BucketNumericalData[]> | Ok<BucketCategoricalData[]> | Err<string> | null)[]

    const successfulData = data.filter(d => d?.ok === true).map(d => d?.data);

    if (field.field_type == "categorical" || field.field_type == "text") {
        const categoricalData = successfulData as (BucketCategoricalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: groupByTimestamp(categoricalData[idx] ?? [])
        }
        ))
    } else if (field.field_type === "bitmask") {
        const categoricalData = successfulData as (BucketCategoricalData[] | null)[];
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: 'heatmap' as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: groupByTimestampAndBitmask(categoricalData[idx] ?? [])
        }));
    } else {
        const numericalData = successfulData as (BucketNumericalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: "numerical" as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: numericalData[idx]?.map(v => ({ timestamp: new Date(v.bucket).getTime(), avg: v.avg, min: v.min, max: v.max })) ?? []
        }))
    }
}
