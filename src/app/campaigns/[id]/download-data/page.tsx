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

type DownloadFileRow = {
    id: string;
    participant_uuid: string;
    participant_email: string;
    sensor_table: string;
    date: string;
    records: DownloadRecord[];
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

const Page = () => {
    const { campaign, campaignParticipants, campaignTables, campaignTableFields } = useCampaign();

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fileRows, setFileRows] = useState<DownloadFileRow[]>([]);

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

    const handlePrepareFiles = async () => {
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

            const grouped = new Map<string, DownloadFileRow>();

            flattenedRows.forEach((record) => {
                const dateOnly = record.timestamp ? record.timestamp.slice(0, 10) : "";
                const key = [
                    record.participant_uuid,
                    dateOnly,
                    record.sensor_table,
                ].join("|");

                const existing = grouped.get(key);
                if (existing) {
                    existing.records.push(record);
                } else {
                    grouped.set(key, {
                        id: key,
                        participant_uuid: record.participant_uuid,
                        participant_email: record.participant_email,
                        sensor_table: record.sensor_table,
                        date: dateOnly,
                        records: [record],
                    });
                }
            });

            setFileRows(Array.from(grouped.values()));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to download data.";
            setErrorMessage(message);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadRow = (row: DownloadFileRow) => {
        if (row.records.length === 0) return;

        const fieldNames = Array.from(new Set(row.records.map((r) => r.sensor_field))).sort();

        const rowsByTimestamp = new Map<
            string,
            {
                participant_uuid: string;
                participant_email: string;
                sensor_table: string;
                timestamp: string;
                values: Record<string, string>;
            }
        >();

        row.records.forEach((record) => {
            const key = record.timestamp;
            let base = rowsByTimestamp.get(key);
            if (!base) {
                base = {
                    participant_uuid: record.participant_uuid,
                    participant_email: record.participant_email,
                    sensor_table: record.sensor_table,
                    timestamp: record.timestamp,
                    values: {},
                };
                rowsByTimestamp.set(key, base);
            }
            base.values[record.sensor_field] = record.value;
        });

        const header = [
            "participant_uuid",
            "participant_email",
            "sensor_table",
            "timestamp",
            ...fieldNames,
        ];

        const body = Array.from(rowsByTimestamp.values())
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
            .map((rowValue) => {
                const baseCols = [
                    rowValue.participant_uuid,
                    rowValue.participant_email,
                    rowValue.sensor_table,
                    rowValue.timestamp,
                ];
                const valueCols = fieldNames.map((field) => rowValue.values[field] ?? "");
                return [...baseCols, ...valueCols].map((v) => csvEscape(String(v))).join(",");
            });

        const csvContent = [header.join(","), ...body].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const safeDate = row.date || `${startDate}-to-${endDate}`;
        link.download = `campaign-${campaign?.id ?? "data"}-${row.participant_uuid}-${row.sensor_table}-${safeDate}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="max-w-3xl">
            <div className="space-y-4">
                <h6 className="text-xl font-semibold text-gray-900">Download Data</h6>
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
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="mt-1 h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="mt-1 h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handlePrepareFiles} disabled={!canDownload || isDownloading}>
                        {isDownloading ? "Preparing files..." : "Generate files"}
                    </Button>
                    {!canDownload && (
                        <span className="text-sm text-gray-500">
                            Select at least 1 participant and 1 sensor, and set a valid date range.
                        </span>
                    )}
                </div>

                {fileRows.length > 0 && (
                    <div className="mt-4">
                        <h6 className="mb-2 text-sm font-semibold text-gray-900">
                            Generated files ({fileRows.length})
                        </h6>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Participant</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Sensor table</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Sensor fields</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Rows</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {fileRows.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-3 py-2 font-mono text-xs text-gray-900">
                                                {row.participant_uuid}
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">{row.participant_email}</td>
                                            <td className="px-3 py-2 text-gray-900">{row.sensor_table}</td>
                                            <td className="px-3 py-2 text-gray-900">
                                                {Array.from(new Set(row.records.map((r) => r.sensor_field)))
                                                    .sort()
                                                    .join(", ")}
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">{row.date}</td>
                                            <td className="px-3 py-2 text-gray-900">{row.records.length}</td>
                                            <td className="px-3 py-2">
                                                <Button
                                                    size="xs"
                                                    onClick={() => handleDownloadRow(row)}
                                                    disabled={row.records.length === 0}
                                                >
                                                    Download
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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
