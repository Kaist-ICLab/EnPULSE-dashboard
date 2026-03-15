import useDownloadDataConfigState from "@/hooks/download/useDownloadDataConfigState";
import useDownloadState from "@/hooks/useDownloadState";
import dayjs from "dayjs";
import { Button, Card } from "flowbite-react";
import ParticipantDropdown from "../dashboard/ParticipantDropdown";
import SensorDropdown from "../dashboard/SensorDropdown";

const DownloadDataConfig = () => {
    const { selectedParticipantIds, selectedFieldIds, setSelectedParticipantIds, setSelectedFieldIds } = useDownloadState();
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        generateDownloadList
    } = useDownloadDataConfigState();

    const canDownload = selectedParticipantIds.length > 0
        && selectedFieldIds.length > 0
        && startDate <= endDate;

    return (
        <Card className="max-w-3xl">
            <div className="space-y-4">
                <h6 className="text-xl font-semibold text-gray-900">Data Configuration</h6>
                <div className="flex flex-row w-full gap-4">
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">Participants</label>
                        <ParticipantDropdown
                            className="mt-1"
                            selectedParticipantIds={selectedParticipantIds}
                            setSelectedParticipantIds={setSelectedParticipantIds}
                            isMultipleSelection={true}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">Sensors</label>
                        <SensorDropdown
                            className="mt-1"
                            selectedFieldIds={selectedFieldIds}
                            setSelectedFieldIds={setSelectedFieldIds}
                            isMultipleSelection={true}
                            showSelectAllSensors={true}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="mt-1 h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={dayjs(startDate).format('YYYY-MM-DD')}
                            onChange={(e) => setStartDate(dayjs(e.target.value).toDate())}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="mt-1 h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={dayjs(endDate).format('YYYY-MM-DD')}
                            onChange={(e) => setEndDate(dayjs(e.target.value).toDate())}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-9">
                    <Button className="w-full" size="md" onClick={generateDownloadList} disabled={!canDownload}>
                        Generate download list
                    </Button>
                </div>


            </div>
        </Card>
    )
}

export default DownloadDataConfig;