import { useEffect, useState } from 'react';

type SampleData = {
  name: string;
  x: number[];
  y: string[];
  color?: string;
};

// Not fruits but whatever...
const fakeFruits = [
  "Bluerange",
  "Sunberry",
  "Tangomelon",
  "Zapplum",
  "Glowpine",
  "Nectarburst",
  "Crimsapple",
  "Frostberry",
  "Jellypear",
  "Sparklemon",
  "Lemon",
  "SuperLongRandomFruitName"
];

export default function useSampleCategoricalData(): {
  data: SampleData | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<SampleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 가짜 로딩 시뮬레이션
        await new Promise((res) => setTimeout(res, 3000));

        const now = new Date();
        const times: number[] = [];
        const sensor: string[] = [];

        for (let i = 0; i < 1000; i++) {
          const t = new Date(now.getTime() + i * 60000); // 1분 간격
          times.push(t.getTime());
          sensor.push(`${fakeFruits[Math.floor(Math.random() * fakeFruits.length)]}`);
        }

        setData({ name: 'Sensor', x: times, y: sensor, color: '#1f77b4' });
      } catch {
        setError('데이터를 불러오는 중 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}
