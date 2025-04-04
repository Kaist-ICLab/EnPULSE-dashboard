import { useEffect, useState } from 'react';

type SampleData = {
  name: string;
  x: number[];
  y: number[];
  color?: string;
};

export default function useSampleNumericalData(): {
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
        await new Promise((res) => setTimeout(res, 3000));

        const now = new Date();
        const times: number[] = [];
        const sensor: number[] = [];

        let currentTime = now.getTime();
        for (let i = 0; i < 1000; i++) {
          const randomGap = Math.floor(Math.random() * (30 * 60 * 1000 - 60 * 1000)) + 60 * 1000; // 1분~30분 랜덤 간격
          currentTime += randomGap;
          times.push(currentTime);
          sensor.push(Math.random()); // 0~1 랜덤값
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