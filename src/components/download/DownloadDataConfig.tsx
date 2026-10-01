import useDownloadDataConfigState from "@/hooks/download/useDownloadDataConfigState";
import useDownloadState from "@/stores/downloadStore";
import dayjs from "dayjs";
import { Button, Card } from "flowbite-react";
import ParticipantDropdown from "../dashboard/ParticipantDropdown";
import SensorFieldDropdown from "../dashboard/SensorFieldDropdown";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";

const DownloadDataConfig = () => {
  const { campaign } = useCampaignStore((state) => state);
  const { selectedParticipantIds, selectedFieldIds, setSelectedParticipantIds, setSelectedFieldIds } =
    useDownloadState();
  const { startDate, setStartDate, endDate, setEndDate, generateDownloadList } = useDownloadDataConfigState();

  const canDownload = selectedParticipantIds.length > 0 && selectedFieldIds.length > 0 && startDate <= endDate;

  return (
    <Card className="max-w-3xl 2xl:max-w-5xl">
      <div className="space-y-4">
        <h6 className="text-xl font-semibold text-gray-900">Data Configuration</h6>
        <div className="flex w-full flex-row gap-4">
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700">Participants</label>
            <ParticipantDropdown
              className="mt-1"
              selectedParticipantIds={selectedParticipantIds}
              setSelectedParticipantIds={setSelectedParticipantIds}
              isMultipleSelection={true}
              showSelectAllParticipants={true}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700">Sensors</label>
            <SensorFieldDropdown
              className="mt-1"
              selectedFieldIds={selectedFieldIds}
              setSelectedFieldIds={setSelectedFieldIds}
              isMultipleSelection={true}
              showSelectAllSensors={true}
              showSurveys={false}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="mt-1 block h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              value={dayjs(startDate).format("YYYY-MM-DD")}
              min={dayjs(campaign?.start_time).format("YYYY-MM-DD")}
              max={dayjs(campaign?.end_time).format("YYYY-MM-DD")}
              onChange={(e) => setStartDate(dayjs(e.target.value).toDate())}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="mt-1 block h-10 w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              value={dayjs(endDate).format("YYYY-MM-DD")}
              min={dayjs(campaign?.start_time).format("YYYY-MM-DD")}
              max={dayjs(campaign?.end_time).format("YYYY-MM-DD")}
              onChange={(e) => setEndDate(dayjs(e.target.value).toDate())}
            />
          </div>
        </div>

        <div className="mt-9 flex items-center gap-3">
          <Button className="w-full" size="md" onClick={generateDownloadList} disabled={!canDownload}>
            Generate download list
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DownloadDataConfig;
