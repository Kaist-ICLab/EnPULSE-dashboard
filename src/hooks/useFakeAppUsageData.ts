import { useEffect, useState } from 'react';

type AppName = "AveryLongSuperRandomNameThatItsSolePurposeIsToOverFlowTheLegendAndWreckIt" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"

type AppUsageData = {
    timestamp: number[]; // UNIX timestamp (ms)
    appName: AppName[];
};

const appNameList: AppName[] = ["AveryLongSuperRandomNameThatItsSolePurposeIsToOverFlowTheLegendAndWreckIt", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]


const generateFakeData = (): AppUsageData => {
    const startTime = new Date().setHours(0, 0, 0, 0);
    const endTime = startTime + 24 * 60 * 60 * 1000;

    // 중간에 missing 구간 (예: 대략 12시간 위치부터 20분)
    const missingStart = startTime + 12 * 60 * 60 * 1000; // 자정 기준 12시간 뒤
    const missingEnd = missingStart + 20 * 60 * 1000; // 20분 간격

    const timestamp: number[] = [];
    const appName: AppName[] = [];

    let currentTime = startTime;
    let currentAppName = appNameList[Math.floor(Math.random() * 26)];

    while (currentTime < endTime) {
        // missing 구간이면 sample 생성 skip
        if (currentTime >= missingStart && currentTime < missingEnd) {
            currentTime = missingEnd;
            continue;
        }

        timestamp.push(currentTime);
        appName.push(currentAppName);

        if (Math.random() > 0.9) {
            currentAppName = appNameList[Math.floor(Math.random() * 26)];
        }

        const interval = (Math.floor(Math.random() * 120) + 5) * 1000;
        currentTime += interval;
    }

    return { timestamp, appName };
}

export default function useFakeAppUsageData(): {
    data: AppUsageData | null;
    loading: boolean;
    error: string | null;
} {
    const [data, setData] = useState<AppUsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                await new Promise((res) => setTimeout(res, 500)); // 가짜 로딩 시간 500ms
                const sample = generateFakeData();
                setData(sample);
            } catch (err) {
                console.error(err);
                setError('데이터를 불러오는 중 오류 발생');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);



    return { data, loading, error };
}
