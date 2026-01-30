import dayjs from "dayjs";

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

export function getLocalDay() {
    return dayjs().startOf('day').toDate()
}

export function millisecondsToTimeString(ms: number): string {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function timeStringToMilliseconds(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000;
}