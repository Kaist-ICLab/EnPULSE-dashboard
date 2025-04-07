'use client'

import Card from "@/components/Card";
import FormatConfigTable, { FormatConfig } from "@/components/settings/FormatConfigTable";
import { useState } from "react";

const Page = () => {
  const [sampleConfig, setSampleConfig] = useState<{ [key: string]: FormatConfig }>({
    sensorData: {
      threshold: 5,
      dataConfig: {
        timestamp: {
          columnRole: 'timestamp',
          dataType: 'datetime',
        },
        user_id: {
          columnRole: 'uid',
          dataType: 'categorical',
        },
        temperature: {
          columnRole: 'data',
          dataType: 'numerical',
        },
        status: {
          columnRole: 'data',
          dataType: 'categorical',
        }
      }
    },
    activityLog: {
      threshold: 10,
      dataConfig: {
        start_time: {
          columnRole: 'timestamp',
          dataType: 'datetime',
        },
        duration: {
          columnRole: 'data',
          dataType: 'timedelta',
        },
        user: {
          columnRole: 'uid',
          dataType: 'categorical',
        },
        irrelevant_column: {
          columnRole: 'ignore',
          dataType: 'categorical',
        }
      }
    }
  });

  return (
    <Card>
      <FormatConfigTable
        config={sampleConfig}
        onConfigSave={(sensor, config) => { sampleConfig[sensor] = config; setSampleConfig({ ...sampleConfig }) }}
      />
    </Card>
  );
}

export default Page;