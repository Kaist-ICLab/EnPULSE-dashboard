'use client'

import { FieldRole, FieldRoleOption, FieldType, FieldTypeOption } from "@/types/campaign";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FieldMappingEditor from "./FieldMappingEditor";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import IconButton from "../common/IconButton";

const PassiveSensingConfigTable: React.FC<{
    tableIdx: number;
}> = ({ tableIdx }) => {
    const { tables, addField, removeField, setField, setFieldMapping, setDailyCountMax } = useCampaignConfigEdit((state) => state);
    const currentTable = useMemo(() => tables[tableIdx], [tables, tableIdx]);

    const [fieldName, setFieldName] = useState('')
    const [fieldRole, setFieldRole] = useState<FieldRole>('data')
    const [fieldType, setFieldType] = useState<FieldType>('numerical')
    const [isFieldInputShown, setIsFieldInputShown] = useState(false)
    const [editingFieldIdx, setEditingFieldIdx] = useState<number | null>(null)

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
                            <TableHeadCell className="bg-gray-200"></TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentTable.campaign_table_field.map((field, fieldIdx) => (
                            <TableRow key={fieldIdx} className="bg-white text-gray-900">
                                <TableCell>{field.name}</TableCell>
                                <FieldRoleCell fieldRole={field.field_role} onChange={(fieldRole) => setField(tableIdx, fieldIdx, 'role', fieldRole)} />
                                <FieldTypeCell fieldType={field.field_type} onChange={(fieldType) => setField(tableIdx, fieldIdx, 'type', fieldType)} />
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        {currentTable.is_custom && removeField && (
                                            <IconButton
                                                onClick={() => removeField(tableIdx, fieldIdx)}
                                                hoverColor="red"
                                                className="icon-[humbleicons--times]"
                                            />
                                        )}
                                        {(field.field_type === 'categorical' || field.field_type === 'bitmask') && field.field_role === 'data' && (
                                            <div className="relative">
                                                <IconButton
                                                    onClick={() => setEditingFieldIdx(fieldIdx)}
                                                    className="icon-[material-symbols--settings]"
                                                />
                                                {(field.campaign_table_field_mapping?.length ?? 0) > 0 && (
                                                    <span className="absolute -top-0.75 -right-0.75 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                            if (fieldName) addField(tableIdx, { campaign_table_id: -1, name: fieldName, field_role: fieldRole, field_type: fieldType, campaign_table_field_mapping: [] })
                                            setIsFieldInputShown(false)
                                        }}
                                    />
                                </TableCell>
                                <FieldRoleCell fieldRole={fieldRole} onChange={setFieldRole} />
                                <FieldTypeCell fieldType={fieldType} onChange={setFieldType} />
                                <TableCell></TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
                {
                    /** Add Field Button */
                    currentTable.is_custom &&
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
                            value={currentTable.daily_count_max}
                            onChange={(e) => setDailyCountMax(tableIdx, Number(e.target.value))}
                            className="w-[80px] outline-none focus:outline-none pl-3"
                        />
                    </div>

                </div>
            </div>

            {editingFieldIdx !== null && (
                <FieldMappingEditor
                    fieldName={currentTable.campaign_table_field[editingFieldIdx]?.name || ''}
                    initialMapping={currentTable.campaign_table_field[editingFieldIdx]?.campaign_table_field_mapping || []}
                    isBitmaskMapping={currentTable.campaign_table_field[editingFieldIdx]?.field_type === 'bitmask'}
                    onClose={() => setEditingFieldIdx(null)}
                    onSave={(mapping) => {
                        setFieldMapping(tableIdx, editingFieldIdx, mapping);
                    }}
                />
            )}
        </div>
    )
};

const FieldRoleCell: React.FC<{
    fieldRole: FieldRole;
    onChange: (fieldRole: FieldRole) => void;
}> = ({ fieldRole, onChange }) => {
    return (
        <TableCell>
            <select
                className="w-[120px] bg-transparent focus:outline-none shadow-none"
                value={fieldRole}
                onChange={(e) => onChange(e.target.value as FieldRole)}
            >
                {FieldRoleOption.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </TableCell>
    )
}

const FieldTypeCell: React.FC<{
    fieldType: FieldType;
    onChange: (fieldType: FieldType) => void;
}> = ({ fieldType, onChange }) => {
    return (
        <TableCell>
            <select
                className="w-[120px] bg-transparent focus:outline-none shadow-none"
                value={fieldType}
                onChange={(e) => onChange(e.target.value as FieldType)}
            >
                {FieldTypeOption.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </TableCell>
    )
}

export default PassiveSensingConfigTable;