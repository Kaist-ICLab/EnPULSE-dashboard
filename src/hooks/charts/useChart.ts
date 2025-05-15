import { ChartParams, ChartType } from "@/types/chart";
import { create } from "zustand";

const chartTypes = [
    ChartType.TimelineOverview,
    ChartType.IntraPerson,
    ChartType.InterPerson
]

interface ChartState {
    chartParams: { [key: string]: ChartParams }
    timeRange: { [key: string]: { start: number, end: number } }
    setChartParams: (key: string, params: ChartParams) => void
    setTimeRange: (key: string, range: { start: number, end: number }) => void
}

const useChart = create<ChartState>((set, get) => ({
    chartParams: chartTypes.reduce((acc, type) => {
        acc[type] = {
            uuid: '',
            date: new Date(),
            fieldId: 0,
        }
        return acc
    }, {} as { [key: string]: ChartParams }),
    timeRange: chartTypes.reduce((acc, type) => {
        acc[type] = { start: 0, end: 0 }
        return acc
    }, {} as { [key: string]: { start: number, end: number } }),
}))
