'use client'
import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import PassiveSensingConfigTable from "../PassiveSensingConfigTable";
import TimingScheduleForm from "./TimingScheduleForm";
import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";
import { TIMING_SENSOR_TABLE_NAME } from "@/types/timingSchedule";
import { useEffect, useRef, useState } from "react";

export default function PassiveSensingForm() {
    const { tables, removeTable, updateTableName, updateTableDisplayName, updateTableDescription } = useCampaignConfigEdit((state) => state);

    const cardRefs = useRef<(HTMLDivElement | HTMLAnchorElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [positions, setPositions] = useState<number[]>([]);

    useEffect(() => {
        const container = cardRefs.current[0]?.closest("main");
        if (!(container instanceof HTMLElement)) return;

        let frame = 0;
        const update = () => {
            const containerTop = container.getBoundingClientRect().top;
            const scrollTop = container.scrollTop;
            const scrollableHeight = container.scrollHeight - container.clientHeight;

            const cardTops = cardRefs.current.map((card) => {
                if (!card) return 0;
                return card.getBoundingClientRect().top - containerTop + scrollTop;
            });

            setPositions(cardTops.map((top) => (scrollableHeight > 0 ? Math.min(1, Math.max(0, top / scrollableHeight)) : 0)));

            const scrolledToBottom = scrollTop + container.clientHeight >= container.scrollHeight - 2;
            if (scrolledToBottom) {
                setActiveIndex(cardTops.length - 1);
                return;
            }
            const threshold = scrollTop + container.clientHeight * 0.2;
            let idx = 0;
            cardTops.forEach((top, i) => { if (top <= threshold) idx = i; });
            setActiveIndex(idx);
        };

        const onScrollOrResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };

        update();
        container.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            cancelAnimationFrame(frame);
            container.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [tables.length]);

    if (tables.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                <p className="text-gray-500 text-lg">No passive sensing is configured</p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                {tables.map((table, tableIndex) => (
                    <Card key={tableIndex} ref={(el) => { cardRefs.current[tableIndex] = el; }}>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <IconButton
                                    onClick={() => removeTable(tableIndex)}
                                    hoverColor="red"
                                    size="lg"
                                    className="icon-[humbleicons--times]"
                                />
                                <div>
                                    {table.is_custom ? (
                                        <SwitchingTextInput className="text-lg font-semibold text-gray-900 whitespace-nowrap" value={table.display_name} onChange={(value) => updateTableDisplayName(tableIndex, value)} />

                                    ) : (
                                        <div className="px-2 py-1.5 text-lg font-semibold text-gray-900 whitespace-nowrap">{table.display_name}</div>
                                    )}

                                </div>
                            </div>
                            <div className="mb-6">
                                {table.is_custom && (
                                    <div className="flex flex-row items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                            DB Table Name
                                        </span>
                                        <SwitchingTextInput sizing="sm" value={table.name ?? ''} onChange={(value) => updateTableName(tableIndex, value)} />
                                    </div>
                                )}
                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        Description
                                    </span>
                                    <SwitchingTextInput sizing="sm" value={table.description ?? ''} onChange={(value) => updateTableDescription(tableIndex, value)} />
                                </div>
                            </div>
                            {table.name === TIMING_SENSOR_TABLE_NAME ? (
                                <TimingScheduleForm />
                            ) : (
                                <PassiveSensingConfigTable
                                    tableIdx={tableIndex}
                                />
                            )}
                        </div>

                    </Card>
                ))}
            </div>
            <nav className="hidden lg:block group fixed right-5 inset-y-24 z-40 w-3">
                <div className="relative h-full">
                    {tables.map((table, tableIndex) => {
                        const isActive = activeIndex === tableIndex;
                        const top = positions[tableIndex] ?? (tableIndex / Math.max(tables.length - 1, 1));
                        return (
                            <button
                                key={tableIndex}
                                type="button"
                                onClick={() => cardRefs.current[tableIndex]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                className="absolute right-0 -translate-y-1/2 flex items-center gap-2 cursor-pointer"
                                style={{ top: `${top * 100}%` }}
                            >
                                <span
                                    className={`whitespace-nowrap text-sm px-2 py-1 rounded-md bg-white border border-gray-200 shadow-sm opacity-0 -translate-x-2 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? "text-blue-700 font-medium" : "text-gray-700"}`}
                                >
                                    {table.display_name}
                                </span>
                                <span
                                    className={`block rounded-full shrink-0 transition-all ${isActive ? "w-3 h-3 bg-blue-600" : "w-2 h-2 bg-gray-300 group-hover:bg-gray-400"}`}
                                />
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    )
}
