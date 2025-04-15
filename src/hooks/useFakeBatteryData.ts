import { useEffect, useState } from 'react';

type BatteryData = {
  timestamp: number[]; // UNIX timestamp (ms)
  level: number[]; // 0 ~ 100 %
  chargetype: ("CHARGING" | "DISCHARGING")[];
};


const generateFakeData = (): BatteryData => {
  const startTime = new Date().setHours(0, 0, 0, 0);
  const endTime = startTime + 24 * 60 * 60 * 1000;

  // 중간에 missing 구간 (예: 대략 12시간 위치부터 20분)
  const missingStart = startTime + 12 * 60 * 60 * 1000; // 자정 기준 12시간 뒤
  const missingEnd = missingStart + 20 * 60 * 1000; // 20분 간격

  const timestamp: number[] = [];
  const level: number[] = [];
  const chargetype: ('CHARGING' | 'DISCHARGING')[] = [];

  let currentTime = startTime;
  let currentLevel = Math.floor(Math.random() * 40) + 30;
  let charging = Math.random() > 0.5;

  while (currentTime < endTime) {
    // missing 구간이면 sample 생성 skip
    if (currentTime >= missingStart && currentTime < missingEnd) {
      currentTime = missingEnd;
      continue;
    }

    timestamp.push(currentTime);
    level.push(currentLevel);
    chargetype.push(charging ? 'CHARGING' : 'DISCHARGING');

    if (charging) {
      currentLevel += Math.random() * .3;
      if (currentLevel > 95) charging = false;
    } else {
      currentLevel -= Math.random() * .1;
      if (currentLevel < 15) charging = true;
    }

    currentLevel = Math.max(0, Math.min(100, currentLevel));
    const interval = (Math.floor(Math.random() * 120) + 5) * 1000;
    currentTime += interval;
  }

  return { timestamp, level, chargetype };
}

export default function useFakeBatteryData(): {
  data: BatteryData | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<BatteryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((res) => setTimeout(res, 500)); // 가짜 로딩 시간 500ms
        const sample = generateFakeData();
        setData(sample);
      } catch (err) {
        setError('데이터를 불러오는 중 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);



  return { data, loading, error };
}
