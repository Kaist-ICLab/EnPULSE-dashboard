import { ChartParams, ChartPinQuery, SectionType } from "@/types/chart";
import { create } from "zustand";
import dayjs from "dayjs";

const DAY = 24 * 60 * 60 * 1000;

function getLocalDay() {
    return dayjs().startOf('day').toDate()
}

export const sectionTypes = Object.freeze([
    SectionType.TimelineOverview,
    SectionType.IntraPerson,
    SectionType.InterPerson
] as const)

interface SectionState {
    sectionParams: { [key: string]: ChartParams }
    timeRange: { [key: string]: { start: number, end: number } }
    chartPinQuery: ChartPinQuery
    setSectionParams: (uuid: string, fieldId: number, date: Date) => void
    updateSectionParams: (key: string, params: Partial<ChartParams>) => void
    updateTimeRange: (key: string, range: { start: number, end: number }) => void
    initTimeRange: (key: string) => void
    initPinQuery: (key: SectionType) => void
    updatePinQuery: (key: SectionType, params: ChartParams | null) => void
}

const useSectionState = create<SectionState>((set) => ({
    sectionParams: sectionTypes.reduce((acc, type) => {
        acc[type] = {
            uuid: '',
            date: getLocalDay(),
            fieldId: 0,
        }
        return acc
    }, {} as { [key: string]: ChartParams }),

    timeRange: sectionTypes.reduce((acc, type) => {
        acc[type] = {
            start: 0,
            end: DAY,
        }
        return acc
    }, {} as { [key: string]: { start: number, end: number } }),

    chartPinQuery: sectionTypes.reduce((acc, type) => {
        acc[type] = null
        return acc
    }, {} as ChartPinQuery),

    setSectionParams: (uuid: string, fieldId: number, date: Date) => {
        sectionTypes.forEach(type => {
            set(state => ({
                sectionParams: { ...state.sectionParams, [type]: { uuid, fieldId, date } }
            }))
        })
    },

    updateSectionParams: (key: string, params: Partial<ChartParams>) => {
        set(state => ({
            sectionParams: { ...state.sectionParams, [key]: { ...state.sectionParams[key], ...params } }
        }))
    },

    initTimeRange: (key: string) => {
        set(state => ({
            timeRange: { ...state.timeRange, [key]: { start: 0, end: DAY } }
        }))
    },

    updateTimeRange: (key: string, range: { start: number, end: number }) => {
        set(state => ({
            timeRange: { ...state.timeRange, [key]: range }
        }))
    },

    initPinQuery: (key: SectionType) => {
        set((state) => ({
            chartPinQuery: { ...state.chartPinQuery, [key]: null }
        }))
    },

    updatePinQuery: (key: SectionType, params: ChartParams | null) => {
        if (key == SectionType.IntraPerson) {
            set(state => ({
                chartPinQuery: { ...state.chartPinQuery, [key]: params }
            }))
        } else if (key == SectionType.InterPerson) {
            set(state => ({
                chartPinQuery: { ...state.chartPinQuery, [key]: params }
            }))
        } else if (key == SectionType.TimelineOverview) {
            set(state => ({
                chartPinQuery: { ...state.chartPinQuery, [key]: params }
            }))
        }
    }
}))

export default useSectionState
