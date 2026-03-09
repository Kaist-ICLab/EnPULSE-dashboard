"use client";

import ParticipantDropdown from "@/components/dashboard/ParticipantDropdown";
import SensorDropdown from "@/components/dashboard/SensorDropdown";
import useCampaign from "@/hooks/useCampaign";
import { supabase } from "@/lib/supabase";
import { Button, Card } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";

type DownloadRecord = {
    participant_uuid: string;
    participant_email: string;
    sensor_table: string;
    sensor_field: string;
    timestamp: string;
    value: string;
};

const toDateInputValue = (rawDate: string | undefined) => {
    if (!rawDate) return "";
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
};

const csvEscape = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replaceAll('"', '""')}"`;
    }
    return value;
};

const toCsv = (records: DownloadRecord[]) => {
    const header = [
        "participant_uuid",
        "participant_email",
        "sensor_table",
        "sensor_field",
        "timestamp",
        "value",
    ];
    const body = records.map((record) =>
        [
            record.participant_uuid,
            record.participant_email,
            record.sensor_table,
            record.sensor_field,
            record.timestamp,
            record.value,
        ]
            .map((v) => csvEscape(v))
            .join(","),
    );

    return [header.join(","), ...body].join("\n");
};

const Page = () => {
    const { campaign, campaignParticipants, campaignTables, campaignTableFields } = useCampaign();

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!campaign) return;
        if (startDate === "") setStartDate(toDateInputValue(campaign.start_time));
        if (endDate === "") setEndDate(toDateInputValue(campaign.end_time));
    }, [campaign, endDate, startDate]);

    const participantEmailById = useMemo(() => {
        return new Map(Array.from(campaignParticipants.values()).map((participant) => [participant.uuid, participant.email]));
    }, [campaignParticipants]);

    const canDownload = selectedParticipantIds.length > 0
        && selectedFieldIds.length > 0
        && startDate !== ""
        && endDate !== ""
        && startDate <= endDate;

    const handleDownload = async () => {
        if (!canDownload) {
            setErrorMessage("Please select participants, sensors, and a valid date period.");
            return;
        }

        setIsDownloading(true);
        setErrorMessage(null);
        try {
            const startIso = new Date(`${startDate}T00:00:00.000Z`).toISOString();
            const endIso = new Date(`${endDate}T23:59:59.999Z`).toISOString();

            const fieldIdsByTable = new Map<number, string[]>();
            selectedFieldIds.forEach((fieldId) => {
                const field = campaignTableFields.get(fieldId);
                if (!field) return;
                const current = fieldIdsByTable.get(field.campaign_table_id) ?? [];
                fieldIdsByTable.set(field.campaign_table_id, [...current, field.name]);
            });

            const queryPromises = Array.from(fieldIdsByTable.entries()).map(async ([tableId, fieldNames]) => {
                const table = campaignTables.get(tableId);
                if (!table) return [];

                const selectedColumns = ["uuid", "timestamp", ...fieldNames].join(",");
                const { data, error } = await supabase
                    .from(table.name as never)
                    .select(selectedColumns)
                    .in("uuid", selectedParticipantIds)
                    .gte("timestamp", startIso)
                    .lte("timestamp", endIso)
                    .order("timestamp", { ascending: true });

                if (error) throw new Error(`Failed to fetch ${table.name}: ${error.message}`);

                const rows = (data ?? []) as Record<string, unknown>[];
                const normalizedRows: DownloadRecord[] = [];

                rows.forEach((row) => {
                    const uuid = String(row.uuid ?? "");
                    const timestamp = String(row.timestamp ?? "");
                    const participantEmail = participantEmailById.get(uuid) ?? "";

                    fieldNames.forEach((fieldName) => {
                        normalizedRows.push({
                            participant_uuid: uuid,
                            participant_email: participantEmail,
                            sensor_table: table.name,
                            sensor_field: fieldName,
                            timestamp,
                            value: String(row[fieldName] ?? ""),
                        });
                    });
                });

                return normalizedRows;
            });

            const queryResults = await Promise.all(queryPromises);
            const flattenedRows = queryResults.flat();
            const csvContent = toCsv(flattenedRows);

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `campaign-${campaign?.id ?? "data"}-${startDate}-to-${endDate}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to download data.";
            setErrorMessage(message);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="max-w-3xl">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Download Data</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Select participants, sensors, and time period to export a CSV file.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Participants</label>
                        <ParticipantDropdown
                            selectedParticipantIds={selectedParticipantIds}
                            setSelectedParticipantIds={setSelectedParticipantIds}
                            isMultipleSelection={true}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Sensors</label>
                        <SensorDropdown
                            selectedFieldIds={selectedFieldIds}
                            setSelectedFieldIds={setSelectedFieldIds}
                            isMultipleSelection={true}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleDownload} disabled={!canDownload || isDownloading}>
                        {isDownloading ? "Preparing CSV..." : "Download CSV"}
                    </Button>
                    {!canDownload && (
                        <span className="text-sm text-gray-500">
                            Select at least 1 participant and 1 sensor, and set a valid date range.
                        </span>
                    )}
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Page;
