import { ChartParams, ChartType, TimelineData } from "@/types/chart";
import { useMemo } from "react";
import useFakeBatteryData from "./useFakeBatteryData";
import useFakeAppUsageData from "./useFakeAppUsageData";


export default function useComparisonChartTimeline(params: ChartParams, type: ChartType) {
    const { data, loading, error } = useFakeBatteryData();
    const { data: appUsageData } = useFakeAppUsageData();

    const timeline = useMemo(() => {
        if (!data || !appUsageData) return []

        const timelineOverviewData = [
            {
                title: "Battery Charge Type",
                id: "battery-chargetype",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "Battery Level",
                id: "battery-level",
                table: "battery",
                column: "level",
                chartType: "numerical",
                timestamp: data.timestamp,
                value: data.level
            },
            {
                title: "App Usage",
                id: "app-usage",
                table: "app_usage",
                column: "app_name",
                chartType: "categorical",
                timestamp: appUsageData.timestamp,
                value: appUsageData.appName
            }
        ]

        const interPersonOverviewData = [
            {
                title: "p01@gmail.com",
                id: "1",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "p02@gmail.com",
                id: "2",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "p03@gmail.com",
                id: "3",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "p04@gmail.com",
                id: "4",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
        ]

        const intraPersonComparisonData = [
            {
                title: "2025-04-23",
                id: "2025-04-23",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "2025-04-22",
                id: "2025-04-22",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "2025-04-21",
                id: "2025-04-21",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
            {
                title: "2025-04-20",
                id: "2025-04-20",
                table: "battery",
                column: "chargetype",
                chartType: "categorical",
                timestamp: data.timestamp,
                value: data.chargetype
            },
        ]

        switch (type) {
            case ChartType.TimelineOverview:
                return timelineOverviewData;
            case ChartType.InterPerson:
                return interPersonOverviewData;
            case ChartType.IntraPerson:
                return intraPersonComparisonData;
        }
    }, [data, appUsageData, type])

    return { timeline: timeline as TimelineData[], loading, error };
}   
