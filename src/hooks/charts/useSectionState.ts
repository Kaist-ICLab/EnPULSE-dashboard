import { ChartParams, ChartPinQuery, ChartPinQueryOption, SectionType } from "@/types/chart";
import { create } from "zustand";

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
    updatePinQuery: (key: SectionType, pinQuery: ChartPinQueryOption) => void
}

const useSectionState = create<SectionState>((set) => ({
    sectionParams: sectionTypes.reduce((acc, type) => {
        acc[type] = {
            uuid: '',
            date: new Date(),
            fieldId: 0,
        }
        return acc
    }, {} as { [key: string]: ChartParams }),

    timeRange: sectionTypes.reduce((acc, type) => {
        acc[type] = {
            start: new Date(0).setHours(0, 0, 0, 0),
            end: new Date(0).setHours(23, 59, 59, 999),
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
            timeRange: { ...state.timeRange, [key]: { start: new Date(0).setHours(0, 0, 0, 0), end: new Date(0).setHours(23, 59, 59, 999) } }
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

    updatePinQuery: (key: SectionType, chartPinQuery: ChartPinQueryOption) => {
        set(state => ({
            chartPinQuery: { ...state.chartPinQuery, [key]: chartPinQuery }
        }))
    }
}))

export default useSectionState
