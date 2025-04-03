import { useEffect, useMemo, useState } from "react";

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

    }
];

export const useUserDailyStat = () => {
    const [data, setData] = useState<UserDailyStat[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // 여기서 API를 호출하는 대신 fake data를 세팅
      const timeout = setTimeout(() => {
        setData(fakeData)
        setLoading(false)
      }, 500) // 시뮬레이션용 딜레이
  
      return () => clearTimeout(timeout)
    }, [])

    const columns = useMemo(() => {
        return data.length > 0 ? Object.keys(data[0].columns) : []
      }, [data])
  
    return { data, columns, loading }
  }

export default useUserDailyStat