import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export type UserDailyStat = {
    id: string;
    email: string;
    contacts: number;
    columns: {
        [name: string]: DynamicDataColumn;
    };
};

export type DynamicDataColumn = {
    dailyCount: number;
    timeline: number[];
};

const fakeData: UserDailyStat[] = [
    {
        id: "1",
        email: "p01@gmail.com",
        contacts: 13,
        columns: {
            call_log: { dailyCount: 25000, timeline: [1, 1, 0, 1, 0, 1, 3, 4] },
            location: { dailyCount: 25, timeline: [1, 0, 1, 0, 1, 0, 3, 4] },
            battery: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_y: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_z: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
        }
    },
    {
        id: "2",
        email: "p02@gmail.com",
        contacts: 13,
        columns: {
            call_log: { dailyCount: 25000, timeline: [1, 1, 0, 1, 0, 1, 3, 4] },
            location: { dailyCount: 25, timeline: [1, 0, 1, 0, 1, 0, 3, 4] },
            battery: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_y: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_z: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
        }
    },
    {
        id: "3",
        email: "p03@gmail.com",
        contacts: 13,
        columns: {
            call_log: { dailyCount: 25000, timeline: [1, 1, 0, 1, 0, 1, 3, 4] },
            location: { dailyCount: 25, timeline: [1, 0, 1, 0, 1, 0, 3, 4] },
            battery: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_y: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_z: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
        }
    },
    {
        id: "4",
        email: "p04@gmail.com",
        contacts: 13,
        columns: {
            call_log: { dailyCount: 25000, timeline: [1, 1, 0, 1, 0, 1, 3, 4] },
            location: { dailyCount: 25, timeline: [1, 0, 1, 0, 1, 0, 3, 4] },
            battery: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_y: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
            x_z: { dailyCount: 25, timeline: [1, 1, 1, 0, 0, 1, 3, 4] },
        }
    },
    {
        id: "5",
        email: "p05@gmail.com",
        contacts: 15,
        columns: {
            call_log: { dailyCount: 28000, timeline: [2, 1, 1, 1, 1, 2, 3, 4] },
            location: { dailyCount: 30, timeline: [2, 1, 1, 1, 1, 2, 3, 4] },
            battery: { dailyCount: 28, timeline: [2, 1, 1, 1, 1, 2, 3, 4] },
            x_y: { dailyCount: 27, timeline: [2, 1, 1, 1, 1, 2, 3, 4] },
            x_z: { dailyCount: 29, timeline: [2, 1, 1, 1, 1, 2, 3, 4] },
        }
    },
    {
        id: "6",
        email: "p06@gmail.com",
        contacts: 18,
        columns: {
            call_log: { dailyCount: 30000, timeline: [2, 2, 1, 2, 1, 2, 3, 4] },
            location: { dailyCount: 32, timeline: [2, 2, 1, 2, 1, 2, 3, 4] },
            battery: { dailyCount: 30, timeline: [2, 2, 1, 2, 1, 2, 3, 4] },
            x_y: { dailyCount: 31, timeline: [2, 2, 1, 2, 1, 2, 3, 4] },
            x_z: { dailyCount: 33, timeline: [2, 2, 1, 2, 1, 2, 3, 4] },
        }
    },
    {
        id: "7",
        email: "p07@gmail.com",
        contacts: 20,
        columns: {
            call_log: { dailyCount: 32000, timeline: [2, 2, 2, 2, 2, 2, 3, 4] },
            location: { dailyCount: 35, timeline: [2, 2, 2, 2, 2, 2, 3, 4] },
            battery: { dailyCount: 33, timeline: [2, 2, 2, 2, 2, 2, 3, 4] },
            x_y: { dailyCount: 34, timeline: [2, 2, 2, 2, 2, 2, 3, 4] },
            x_z: { dailyCount: 36, timeline: [2, 2, 2, 2, 2, 2, 3, 4] },
        }
    },
    {
        id: "8",
        email: "p08@gmail.com",
        contacts: 22,
        columns: {
            call_log: { dailyCount: 35000, timeline: [3, 2, 2, 2, 2, 3, 3, 4] },
            location: { dailyCount: 38, timeline: [3, 2, 2, 2, 2, 3, 3, 4] },
            battery: { dailyCount: 36, timeline: [3, 2, 2, 2, 2, 3, 3, 4] },
            x_y: { dailyCount: 37, timeline: [3, 2, 2, 2, 2, 3, 3, 4] },
            x_z: { dailyCount: 39, timeline: [3, 2, 2, 2, 2, 3, 3, 4] },
        }
    },
    {
        id: "9",
        email: "p09@gmail.com",
        contacts: 25,
        columns: {
            call_log: { dailyCount: 38000, timeline: [3, 3, 2, 3, 2, 3, 3, 4] },
            location: { dailyCount: 40, timeline: [3, 3, 2, 3, 2, 3, 3, 4] },
            battery: { dailyCount: 39, timeline: [3, 3, 2, 3, 2, 3, 3, 4] },
            x_y: { dailyCount: 41, timeline: [3, 3, 2, 3, 2, 3, 3, 4] },
            x_z: { dailyCount: 42, timeline: [3, 3, 2, 3, 2, 3, 3, 4] },
        }
    },
    {
        id: "10",
        email: "p10@gmail.com",
        contacts: 28,
        columns: {
            call_log: { dailyCount: 40000, timeline: [3, 3, 3, 3, 3, 3, 3, 4] },
            location: { dailyCount: 42, timeline: [3, 3, 3, 3, 3, 3, 3, 4] },
            battery: { dailyCount: 41, timeline: [3, 3, 3, 3, 3, 3, 3, 4] },
            x_y: { dailyCount: 43, timeline: [3, 3, 3, 3, 3, 3, 3, 4] },
            x_z: { dailyCount: 44, timeline: [3, 3, 3, 3, 3, 3, 3, 4] },
        }
    },
    {
        id: "11",
        email: "p11@gmail.com",
        contacts: 30,
        columns: {
            call_log: { dailyCount: 42000, timeline: [4, 3, 3, 3, 3, 4, 3, 4] },
            location: { dailyCount: 45, timeline: [4, 3, 3, 3, 3, 4, 3, 4] },
            battery: { dailyCount: 44, timeline: [4, 3, 3, 3, 3, 4, 3, 4] },
            x_y: { dailyCount: 46, timeline: [4, 3, 3, 3, 3, 4, 3, 4] },
            x_z: { dailyCount: 47, timeline: [4, 3, 3, 3, 3, 4, 3, 4] },
        }
    },
    {
        id: "12",
        email: "p12@gmail.com",
        contacts: 32,
        columns: {
            call_log: { dailyCount: 45000, timeline: [4, 4, 3, 4, 3, 4, 3, 4] },
            location: { dailyCount: 48, timeline: [4, 4, 3, 4, 3, 4, 3, 4] },
            battery: { dailyCount: 47, timeline: [4, 4, 3, 4, 3, 4, 3, 4] },
            x_y: { dailyCount: 49, timeline: [4, 4, 3, 4, 3, 4, 3, 4] },
            x_z: { dailyCount: 50, timeline: [4, 4, 3, 4, 3, 4, 3, 4] },
        }
    },
    {
        id: "13",
        email: "p13@gmail.com",
        contacts: 35,
        columns: {
            call_log: { dailyCount: 48000, timeline: [4, 4, 4, 4, 4, 4, 3, 4] },
            location: { dailyCount: 50, timeline: [4, 4, 4, 4, 4, 4, 3, 4] },
            battery: { dailyCount: 49, timeline: [4, 4, 4, 4, 4, 4, 3, 4] },
            x_y: { dailyCount: 51, timeline: [4, 4, 4, 4, 4, 4, 3, 4] },
            x_z: { dailyCount: 52, timeline: [4, 4, 4, 4, 4, 4, 3, 4] },
        }
    },
    {
        id: "14",
        email: "p14@gmail.com",
        contacts: 38,
        columns: {
            call_log: { dailyCount: 50000, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            location: { dailyCount: 52, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            battery: { dailyCount: 51, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            x_y: { dailyCount: 53, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            x_z: { dailyCount: 54, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
        }
    },
    {
        id: "15",
        email: "p15@gmail.com",
        contacts: 40,
        columns: {
            call_log: { dailyCount: 52000, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            location: { dailyCount: 55, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            battery: { dailyCount: 54, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            x_y: { dailyCount: 56, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
            x_z: { dailyCount: 57, timeline: [4, 4, 4, 4, 4, 4, 4, 4] },
        }
    }
];

export const useUserDailyStat = (
    date: Date,
    page: number,
    rowsPerPage: number,
    setTotalPage: Dispatch<SetStateAction<number>>
) => {
    const [data, setData] = useState<UserDailyStat[]>([])
    const [loading, setLoading] = useState(true)

    const columns = useMemo(() => {
        return data.length > 0 ? Object.keys(data[0].columns) : []
    }, [data])

    // In practice, this should be calculated by the server as the client cannot see all the data
    const maxDailyCount = useMemo(() => {
        const result: { [key: string]: number } = {};
        columns.forEach(column => {
            result[column] = fakeData.reduce((max, user) => {
                return Math.max(max, user.columns[column].dailyCount);
            }, 0);
        });
        return result;
    }, [columns]);

    // TODO: Replace with actual API call
    useEffect(() => {
        setLoading(true)
        console.log("Pertending to load data...", date, page, rowsPerPage)

        setTimeout(() => {
            setData(fakeData.slice((page - 1) * rowsPerPage, page * rowsPerPage))
            setTotalPage(Math.ceil(fakeData.length / rowsPerPage))
            setLoading(false)
        }, 500) // 시뮬레이션용 딜레이
    }, [date, page, rowsPerPage, setTotalPage])

    return { data, columns, maxDailyCount, loading }
}

export default useUserDailyStat