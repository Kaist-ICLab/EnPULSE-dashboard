import { ChartPinQuery, ComparisonType, ComparisonParams, TimelineParams } from "@/types/chart";
import { create } from "zustand";
import dayjs from "dayjs";
import { getLocalDay } from "@/utils/date";

const DAY = 24 * 60 * 60 * 1000;

export const comparisonTypes = Object.freeze([
    ComparisonType.Sensors,
    ComparisonType.Days,
    ComparisonType.Participants
] as const)

interface SectionState {
    date: Date,
    timeRange: { start: number, end: number }
    comparisonParams: { [key in ComparisonType]: ComparisonParams },
    draggedTime: number
    selectedSection: ComparisonType,
    chartPinQuery: ChartPinQuery
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

const useSectionState = create<SectionState>((set) => ({
    date: getLocalDay(),
    selectedSection: ComparisonType.Sensors,
    comparisonParams: comparisonTypes.reduce((acc, type) => {
        acc[type] = { uuid: [], fieldId: [] }
        return acc
    }, {} as { [key in ComparisonType]: ComparisonParams }),
    timeRange: { start: 0, end: DAY },
    chartPinQuery: { date: null, uuid: null, fieldId: null },
    draggedTime: 0,

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

export default useSectionState
