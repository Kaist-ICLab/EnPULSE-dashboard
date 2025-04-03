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
    let i = 0
    const now = new Date();

    const load = async () => {
      const times: number[] = [];
      const sensor: string[] = [];

      try {
        // 가짜 로딩 시뮬레이션
        await new Promise((res) => setTimeout(res, 3000));


        for (; i < 1000; i++) {
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

      // Imitate data stream
      setInterval(() => {
        setData(data => {
          if (!data) return data

          const newData = { ...data }
          newData.x.push(newData.x[newData.x.length - 1] + 600000)
          newData.y.push(`${fakeFruits[Math.floor(Math.random() * fakeFruits.length)]}`)
          return newData
        })
      }, 5000);
    }

    load();
  }, []);

  return { data, loading, error };
}
