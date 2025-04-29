'use client'

import { CampaignTableField, FieldRole, FieldRoleOption, FieldType, FieldTypeOption } from "@/types/campaign";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

const FormatConfigTable: React.FC<{
    currentTableFields: CampaignTableField[];
    // setChangedFields: (callback: (prev: Map<string, string>) => Map<string, string>) => void;
    onFieldChange: (fieldId: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ currentTableFields, onFieldChange, setDailyCountThreshold, dailyCountThreshold }) => {
    return (
        <>
            <Table className="w-fit">
                <TableHead>
                    <TableRow>
                        {["field name", "field role", "field type"].map((header) => (
                            <TableHeadCell key={header}>{header}</TableHeadCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentTableFields.map((field) => (
                        <TableRow key={field.id} className="bg-white text-gray-900">
                            <TableCell>{field.name}</TableCell>
                            <TableCell>
                                <select
                                    className="w-[120px] bg-transparent focus:outline-none p-2 shadow-none"
                                    defaultValue={field.field_role}
                                    onChange={(e) => onFieldChange(field.id, 'role', e.target.value as FieldRole)}
                                >
                                    {FieldRoleOption.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </TableCell>
                            <TableCell>
                                <select
                                    className="w-[120px] bg-transparent focus:outline-none p-2 shadow-none"
                                    defaultValue={field.field_type}
                                    onChange={(e) => {
                                        // if (e.target.value !== field.field_type) {
                                        //     setChangedFields(prev => new Map(prev.set("field_type-" + field.id.toString(), e.target.value)));
                                        // } else {
                                        //     setChangedFields(prev => {
                                        //         const newMap = new Map(prev);
                                        //         newMap.delete("field_type-" + field.id.toString());
                                        //         return newMap;
                                        //     });
                                        // }
                                        onFieldChange(field.id, 'type', e.target.value as FieldType)
                                    }}
                                >
                                    {FieldTypeOption.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="w-fit mt-3 flex flex-col border-1 border-gray-200 divide-y divide-gray-200">
                <div className="flex divide-x divide-gray-200">
                    <div className="bg-gray-50 px-4 py-3 uppercase text-sm">
                        Daily Count Threshold
                    </div>
                    <input
                        type="number"
                        value={dailyCountThreshold}
                        onChange={(e) => setDailyCountThreshold(Number(e.target.value))}
                        className="w-[80px] outline-none focus:outline-none pl-3"
                    />
                </div>
            </div>
        </>
    )
};

export default FormatConfigTable;