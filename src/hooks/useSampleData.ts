import { useEffect, useState } from 'react';

type SampleData = {
  name: string;
  x: number[];
  y: number[];
  color?: string;
};

export default function useSampleData(): {
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
        const sensor: number[] = [];

        for (let i = 0; i < 500; i++) {
          const t = new Date(now.getTime() + i * 60000); // 1분 간격
          times.push(t.getTime());
          sensor.push(Math.sin(i / 50) + Math.random() * 0.2);
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
