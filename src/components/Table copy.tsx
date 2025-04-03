import * as dfd from "danfojs";
import React from "react";

const Table: React.FC<{
    data: dfd.DataFrame
    className?: string
}> = ({ data, className }) => {
    return (
        <table className={(className ?? "") + "w-full relative overflow-x-auto sm:rounded-lg"}>
            <colgroup>
                <col className="w-[150px]" />
                <col className="w-auto" />
            </colgroup>
            <thead className="text-left text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    {
                        data.columns.map((col, index) => (
                            <th key={index} scope="col" className="px-6 py-3 pr-12">
                                {col}
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    data.values.map((row, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                            {(row as string[]).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-6 py-4 pr-12">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))
                }
                {/* <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td> */}
            </tbody>
        </table>
    )
}

export default Table