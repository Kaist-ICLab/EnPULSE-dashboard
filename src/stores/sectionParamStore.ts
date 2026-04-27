import { TimelineParams } from "@/types/chart";
import { ChartPinQuery } from "@/types/dashboard";
import { ComparisonParams } from "@/types/dashboard";
import { ComparisonType } from "@/types/dashboard";
import { FetchedCampaign } from "@/types/campaign";
import { create } from "zustand";
import dayjs from "dayjs";
import { getLocalDay } from "@/utils/date";

const DAY = 24 * 60 * 60 * 1000;

export const comparisonTypes = Object.freeze([
    ComparisonType.Sensors,
    ComparisonType.Days,
    ComparisonType.Participants
] as const)

export type SectionParamState = {
    lastManualSyncTime: number,
    date: Date,
    timeRange: { start: number, end: number }
    comparisonParams: { [key in ComparisonType]: ComparisonParams },
    draggedTime: number
    selectedSection: ComparisonType,
    chartPinQuery: ChartPinQuery
}

export type SectionParamActions = {
    setLastManualSyncTime: (time: number) => void,
    updateDate: (date: Date) => void,
    addDaysToDate: (days: number) => void,
    updateSelectedSection: (section: ComparisonType) => void
    updateComparisonTypeFromPin: (section: ComparisonType, params: TimelineParams) => void
    updateComparisonParams: (comparisonType: ComparisonType, params: Partial<ComparisonParams>) => void
    updateDraggedTime: (time: number) => void
    initTimeRange: () => void
    updateTimeRange: (range: { start: number, end: number }) => void
    updateTimeRangeAfterDrag: () => void
    initPinQuery: () => void
    updatePinQuery: (params: ChartPinQuery) => void
}

export type SectionParamStore = SectionParamState & SectionParamActions;

function getInitialDate(campaign?: FetchedCampaign): Date {
    if (!campaign) return getLocalDay();

    if (dayjs(campaign.start_time).toDate() >= new Date()) {
        return dayjs(campaign.start_time).toDate();
    }
    if (dayjs(campaign.end_time).toDate() <= new Date()) {
        return dayjs(campaign.end_time).toDate();
    }
    return getLocalDay();
}

function getInitialComparisonParams(
    campaign?: FetchedCampaign,
): { [key in ComparisonType]: ComparisonParams } {
    const firstUuid = campaign?.profiles.slice(0, 1).map(p => p.uuid) ?? [];
    return comparisonTypes.reduce((acc, type) => {
        acc[type] = { uuid: firstUuid, fieldId: [] };
        return acc;
    }, {} as { [key in ComparisonType]: ComparisonParams });
}

export const createSectionParamStore = (
    campaign?: FetchedCampaign,
) => {
    return create<SectionParamStore>((set) => ({
        lastManualSyncTime: 0,
        date: getInitialDate(campaign),
        selectedSection: ComparisonType.Sensors,
        comparisonParams: getInitialComparisonParams(campaign),
        timeRange: { start: 0, end: DAY },
        chartPinQuery: { date: null, uuid: null, fieldId: null },
        draggedTime: 0,

        setLastManualSyncTime: (time: number) => {
            set(() => ({
                lastManualSyncTime: time
            }))
        },

        updateDate: (date: Date) => {
            set(() => ({
                date: date
            }))
        },

        addDaysToDate: (days: number) => {
            set((state) => ({
                date: dayjs(state.date).add(days, 'day').toDate()
            }))
        },

        updateSelectedSection: (section: ComparisonType) => {
            set(() => ({
                selectedSection: section
            }))
        },

        updateComparisonTypeFromPin: (section: ComparisonType, params: TimelineParams) => {
            set((state) => ({
                date: params.date,
                selectedSection: section,
                comparisonParams: { ...state.comparisonParams, [section]: { uuid: [params.uuid], fieldId: [params.fieldId] } }
            }))
        },

        updateComparisonParams: (comparisonType: ComparisonType, params: Partial<ComparisonParams>) => {
            set((state) => ({
                comparisonParams: { ...state.comparisonParams, [comparisonType]: { ...state.comparisonParams[comparisonType], ...params } }
            }))
        },

        updateDraggedTime: (time: number) => {
            set(() => ({
                draggedTime: time
            }))
        },

        updateTimeRangeAfterDrag: () => {
            set(state => {
                const prevRange = state.timeRange;
                const dragged = state.draggedTime;
                const date = state.date;

                const currentDate = dayjs(date).startOf('day')
                const draggedMidpointDate = dayjs(date).add((state.timeRange.start + state.timeRange.end) / 2, 'ms').add(dragged, 'ms').startOf('day')
                const rangeTimeDelta = draggedMidpointDate.diff(currentDate, 'ms')

                const newRange = {
                    start: prevRange.start - rangeTimeDelta + dragged,
                    end: prevRange.end - rangeTimeDelta + dragged
                }

                return {
                    timeRange: newRange,
                    draggedTime: 0,
                    date: draggedMidpointDate.toDate(),
                };
            });
        },

        initTimeRange: () => {
            set(() => ({
                timeRange: { start: 0, end: DAY }
            }))
        },

        updateTimeRange: (range: { start: number, end: number }) => {
            set(() => ({
                timeRange: range
            }))
        },

        initPinQuery: () => {
            set(() => ({
                chartPinQuery: { date: null, uuid: null, fieldId: null }
            }))
        },

        updatePinQuery: (params: ChartPinQuery) => {
            set(() => ({
                chartPinQuery: params
            }))
        }
    }))
}
