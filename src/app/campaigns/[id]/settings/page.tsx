
'use client'
import { Card } from "flowbite-react";
import FormatConfigTable, { FormatConfig } from "@/components/settings/FormatConfigTable";
import { useState } from "react";
import DatabaseConnection from "@/components/settings/DatabaseConnection";
import RenameCampaign from "@/components/settings/RenameCampaign";

const Page = () => {
  const [sampleConfig, setSampleConfig] = useState<{ [key: string]: FormatConfig }>({
    sensorData: {
      thresholdMode: 'value',
      threshold: 5,
      dataConfig: {
        timestamp: { columnRole: 'timestamp', dataType: 'datetime', },
        user_id: { columnRole: 'uid', dataType: 'categorical', },
        temperature: { columnRole: 'data', dataType: 'numerical', },
        status: { columnRole: 'data', dataType: 'categorical', }
      }
    },
    activityLog: {
      thresholdMode: 'value',
      threshold: 10,
      dataConfig: {
        start_time: { columnRole: 'timestamp', dataType: 'datetime', },
        duration: { columnRole: 'data', dataType: 'timedelta', },
        user: { columnRole: 'uid', dataType: 'categorical', },
        irrelevant_column: { columnRole: 'ignore', dataType: 'categorical', }
      }
    }
  });


  return (<Card>
    <RenameCampaign />
    <DatabaseConnection />
    <FormatConfigTable
      config={sampleConfig}
      onConfigSave={(sensor, config) => { sampleConfig[sensor] = config; setSampleConfig({ ...sampleConfig }) }} />
  </Card>);
}

export default Page;
// 'use client'

// import { Card } from "flowbite-react";
// import DatabaseConnection from "@/components/DatabaseConnection";
// import RenameCampaign from "@/components/RenameCampaign";

// const Page = () => {
//   return (
//     <div className="p-4">
//       <Card className="mb-4">
//         <div className="space-y-6">
//           <RenameCampaign />
//           <DatabaseConnection />
//         </div>
//       </Card>
//     </div>
//   );
// }
