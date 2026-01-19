import { TimelineParams as TimelineParams, ChartPinQuery, SectionType } from "@/types/chart";
import { create } from "zustand";
import dayjs from "dayjs";
import { getLocalDay } from "@/utils/date";

const DAY = 24 * 60 * 60 * 1000;

export const sectionTypes = Object.freeze([
    SectionType.TimelineOverview,
    SectionType.IntraPerson,
    SectionType.InterPerson
] as const)

interface SectionState {
    selectedSection: SectionType,
    timelineParams: TimelineParams,
    timeRange: { start: number, end: number }
    draggedTime: number
    chartPinQuery: ChartPinQuery
    updateSelectedSection: (section: SectionType) => void
    updateTimelineParams: (params: Partial<TimelineParams>) => void
    updateDraggedTime: (time: number) => void
    initTimeRange: () => void
    updateTimeRange: (range: { start: number, end: number }) => void
    updateTimeRangeAfterDrag: () => void
    initPinQuery: () => void
    updatePinQuery: (params: ChartPinQuery) => void
}

const useSectionState = create<SectionState>((set) => ({
    selectedSection: SectionType.TimelineOverview,
    timelineParams: { date: getLocalDay(), uuid: '', fieldId: 0 },
    timeRange: { start: 0, end: DAY },
    chartPinQuery: { date: null, uuid: null, fieldId: null },
    draggedTime: 0,

    updateSelectedSection: (section: SectionType) => {
        set(() => ({
            selectedSection: section
        }))
    },

    updateTimelineParams: (params: Partial<TimelineParams>) => {
        set((state) => ({
            timelineParams: { ...state.timelineParams, ...params }
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
            const date = state.timelineParams.date;

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
                timelineParams: { ...state.timelineParams, date: draggedMidpointDate.toDate() },
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
