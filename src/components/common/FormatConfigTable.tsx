'use client'

import { CampaignTableField, FieldRole, FieldRoleOption, FieldType, FieldTypeOption } from "@/types/campaign";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

const FormatConfigTable: React.FC<{
    currentTableFields: CampaignTableField[];
    // setChangedFields: (callback: (prev: Map<string, string>) => Map<string, string>) => void;
    canAddField: boolean | undefined;
    onFieldChange: (fieldId: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    addField: (field: CampaignTableField) => void,
    setDailyCountThreshold: (threshold: number) => void;
    dailyCountThreshold: number;
}> = ({ currentTableFields, onFieldChange, addField, setDailyCountThreshold, dailyCountThreshold, canAddField = false }) => {
    const [fieldName, setFieldName] = useState('')
    const [fieldRole, setFieldRole] = useState<FieldRole>('data')
    const [fieldType, setFieldType] = useState<FieldType>('numerical')
    const [isFieldInputShown, setIsFieldInputShown] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (isFieldInputShown && inputRef.current) inputRef.current.focus()
    }, [isFieldInputShown])

    return (
        <div>
            <div className="w-fit border-gray-200 rounded-lg! border-1">
                <Table className="w-fit ">
                    <TableHead>
                        <TableRow>
                            {["field name", "field role", "field type"].map((header) => (
                                <TableHeadCell key={header} className="bg-gray-200">{header}</TableHeadCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentTableFields.map((field) => (
                            <TableRow key={field.id} className="bg-white text-gray-900">
                                <TableCell>{field.name}</TableCell>
                                <TableCell>
                                    <select
                                        className="w-[120px] bg-transparent focus:outline-none shadow-none"
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
                                        className="w-[120px] bg-transparent focus:outline-none shadow-none"
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
                        {isFieldInputShown &&
                            <TableRow className="bg-white text-gray-900">
                                <TableCell>
                                    <input
                                        ref={inputRef}
                                        value={fieldName}
                                        className="w-[120px] bg-transparent focus:outline-none shadow-none border-b-2 border-gray-200"
                                        onChange={e => setFieldName(e.target.value)}
                                        onBlur={() => {
                                            if (fieldName) addField({ id: -1, campaign_id: -1, campaign_table_id: -1, name: fieldName, field_role: fieldRole, field_type: fieldType })
                                            setIsFieldInputShown(false)
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <select
                                        className="w-[120px] bg-transparent focus:outline-none shadow-none"
                                        value={fieldRole}
                                        onChange={(e) => setFieldRole(e.target.value as FieldRole)}
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
                                        className="w-[120px] bg-transparent focus:outline-none shadow-none"
                                        value={fieldType}
                                        onChange={(e) => setFieldType(e.target.value as FieldType)}
                                    >
                                        {FieldTypeOption.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                            </TableRow>

                        }
                    </TableBody>
                </Table>
                {
                    canAddField &&
                    <div
                        className="w-full px-6 py-2 flex justify-center items-center border-t-1 border-gray-200 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                            setFieldName("")
                            setFieldRole('data')
                            setFieldType('numerical')
                            setIsFieldInputShown(true)
                        }}
                    >
                        <span className="icon-[tabler--plus] mr-2"></span> Add Field
                    </div>
                }
            </div>
            <div className="w-fit flex flex-col mt-2">
                <div className="flex rounded-lg border-1 border-gray-200 overflow-hidden">
                    <div className="bg-gray-200 px-6 py-3 uppercase text-xs text-gray-700 font-bold">
                        Daily Count Threshold
                    </div>
                    <div className="flex">
                        <input
                            type="number"
                            value={dailyCountThreshold}
                            onChange={(e) => setDailyCountThreshold(Number(e.target.value))}
                            className="w-[80px] outline-none focus:outline-none pl-3"
                        />
                    </div>

                </div>
            </div>
        </div>
    )
};

export default FormatConfigTable;