import dayjs from "dayjs";

export function getLocalDay() {
    return dayjs().startOf('day').toDate()
}
