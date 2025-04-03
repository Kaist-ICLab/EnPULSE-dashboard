import React from "react";

const Table: React.FC<{
    headers: string[];
    table_data: { uid: string; contact_history: number; data: { [key: string]: { max_count: number; count: number; timeline: number } } }[];
}> = ({ headers, table_data }) => {
    const columnCount = headers.length * 2 + 3;
    return (
        <div className="w-full flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <div className="text-xl text-left px-4 py-4 self-baseline">
                Overview
            </div>
            <table className="w-full relative overflow-x-auto">
                <colgroup>
                    {Array.from({ length: columnCount }).map((_, index) => (
                        <col
                            key={`colgroup-${index}`}
                            className={
                                index === columnCount - 1 ? "w-auto" : "min-w-[150px]"
                            }
                        />
                    ))}
                </colgroup>
                <thead className="text-sm text-left font-semibold text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 pr-8" rowSpan={2}>
                            <input type="checkbox" disabled />
                        </th>
                        <th rowSpan={2} className="px-4 py-2 pr-8">UID</th>
                        <th rowSpan={2} className="px-4 py-2 pr-8">Contact History</th>
                        {headers.map((header, index) => (<th key={index} className="px-4 py-2 pr-8 text-center" colSpan={2}>{header}</th>))}
                    </tr>
                    <tr>
                        {headers.map((header, index) => (
                            ["COUNT", "TIMELINE"].map((label, index) => (
                                <th
                                    key={`th-${index}`}
                                    className="px-4 py-2 pr-8 text-center"
                                >
                                    {label}
                                </th>
                            ))
                        ))}
                    </tr>
                </thead>
                <tbody className="text-lg">
                    {table_data.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-2 text-left"><input type="checkbox" /></td>
                            <td className="px-4 py-2 text-left">{row["uid"]}</td>
                            <td className="px-4 py-2 text-left">{`${row["contact_history"]} contacts`}</td>
                            {headers.map((header, colIndex) => {
                                const data = row.data[header] || {};
                                return [
                                    <td key={`cell-${rowIndex}-${colIndex}-1`} className="px-4 py-2 pr-8 text-center">
                                        {data.count}
                                    </td>,
                                    <td key={`cell-${rowIndex}-${colIndex}-2`} className="px-4 py-2 pr-8 text-center">
                                        {data.timeline}
                                    </td>
                                ]
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Table