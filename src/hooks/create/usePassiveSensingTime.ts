import { useCallback, useMemo } from "react";
import useCampaignConfigEdit from "../useCampaignConfigEdit";

const millisecondsToTimeString = (ms: number): string => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const timeStringToMilliseconds = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000;
}

/**
 * Hook for managing passive sensing time configuration
 * Handles conversion between time strings (HH:MM) and milliseconds
 */
export const usePassiveSensingTime = () => {
    const { passiveSensingConfig, setPassiveSensingStartTime, setPassiveSensingEndTime } = useCampaignConfigEdit();

    const startTimeString = useMemo(() => millisecondsToTimeString(passiveSensingConfig.startTime), [passiveSensingConfig.startTime]);
    const endTimeString = useMemo(() => millisecondsToTimeString(passiveSensingConfig.endTime), [passiveSensingConfig.endTime]);
    const endTimeNextDay = useMemo(() => passiveSensingConfig.endTime >= (24 * 60 * 60 * 1000), [passiveSensingConfig.endTime]);

    /**
     * Set start time from HH:MM string
     */
    const setStartTime = useCallback((timeString: string) => {
        const startMs = timeStringToMilliseconds(timeString);
        const endMs = passiveSensingConfig.endTime;

        // If end time is before start time (considering next day), automatically set endTimeNextDay
        const shouldEndNextDay = endMs < startMs;

        setPassiveSensingStartTime(startMs);
        if (shouldEndNextDay) {
            setPassiveSensingEndTime(endMs + (24 * 60 * 60 * 1000));
        }
    }, [passiveSensingConfig, setPassiveSensingStartTime, setPassiveSensingEndTime]);

    /**
     * Set end time from HH:MM string
     */
    const setEndTime = useCallback((timeString: string) => {
        const endMs = timeStringToMilliseconds(timeString);
        const startMs = passiveSensingConfig.startTime;
        // If end time is before or equal to start time, it must be next day
        const shouldEndNextDay = endMs <= startMs;

        setPassiveSensingEndTime(endMs + (shouldEndNextDay ? (24 * 60 * 60 * 1000) : 0));
    }, [passiveSensingConfig.startTime, setPassiveSensingEndTime]);

    return {
        startTimeString,
        endTimeString,
        endTimeNextDay,
        setStartTime,
        setEndTime,
    };
};
