'use client'

import Card from "@/components/Card";
import FormatConfigTable, { FormatConfig } from "@/components/settings/FormatConfigTable";
import { useState } from "react";

const Page = () => {
  const [sampleConfig, setSampleConfig] = useState<{ [key: string]: FormatConfig }>({
    sensorData: {
      timestamp: {
        columnRole: 'timestamp',
        dataType: 'datetime',
        threshold: 0
      },
      user_id: {
        columnRole: 'uid',
        dataType: 'categorical',
        threshold: 0
      },
      temperature: {
        columnRole: 'data',
        dataType: 'numerical',
        threshold: 0.1
      },
      status: {
        columnRole: 'data',
        dataType: 'categorical',
        threshold: 0.05
      }
    },
    activityLog: {
      start_time: {
        columnRole: 'timestamp',
        dataType: 'datetime',
        threshold: 0
      },
      duration: {
        columnRole: 'data',
        dataType: 'timedelta',
        threshold: 0.01
      },
      user: {
        columnRole: 'uid',
        dataType: 'categorical',
        threshold: 0
      },
      irrelevant_column: {
        columnRole: 'ignore',
        dataType: 'categorical',
        threshold: 0
      }
    }
  });

  return (
    <Card>
      <FormatConfigTable
        config={sampleConfig}
      />
    </Card>
  );
}

export default Page;