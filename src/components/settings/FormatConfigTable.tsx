'use client'

import useFormatConfig from "@/hooks/legacy/useFormatConfig"
import { Button, Select, Spinner, TextInput } from "flowbite-react"
import React, { useEffect, useState } from "react"

export type ColumnRole = 'timestamp' | 'ignore' | 'uid' | 'data'
export type DataType = 'datetime' | 'categorical' | 'timedelta' | 'numerical'
export type ThresholdMode = 'max' | 'value'

type FormatConfigEntry = {
    columnRole: ColumnRole,
    dataType: DataType
}

export type FormatConfig = {
    threshold: number
    thresholdMode: ThresholdMode,
    dataConfig: { [key: string]: FormatConfigEntry }
}

const columnRoleOptions: ColumnRole[] = ['timestamp', 'uid', 'data', 'ignore']
const dataTypeOptions: DataType[] = ['datetime', 'categorical', 'timedelta', 'numerical']
const displayedThresholdModeOptions: ThresholdMode[] = ['value', 'max']

export default function FormatConfigTable() {
    const [currentSensor, setCurrentSensor] = useState('')
    const {
        loading,
        sensors,
        formatConfig,
        hasUnsavedChanges,
        loadFormatConfig,
        updateColumnRole,
        updateDataType,
        updateThreshold,
        uploadFormatConfig,
    } = useFormatConfig()

    useEffect(() => {
        setCurrentSensor(sensors[0])
    }, [sensors])

    return (
        <div className="w-full">
            <h2 className="mb-2 font-medium text-xl">Format Configuration</h2>
            <div className="w-full py-1 mb-4 flex">
                <Select
                    value={currentSensor}
                    onChange={(e) => { setCurrentSensor(e.target.value); loadFormatConfig() }}
                    className="w-32"
                >
                    {
                        sensors.map((v, i) =>
                            <option key={i}>{v}</option>
                        )
                    }
                </Select>
                <div className="w-2"></div>
                <Button
                    className="transition-opacity duration-100"
                    onClick={() => { uploadFormatConfig() }}
                    disabled={!hasUnsavedChanges}
                >
                    Save
                </Button>
            </div>
            {loading ? (
                <div className="w-full max-w-3xl flex justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="w-full">
                    <div className="max-w-3xl flex flex-col border-1 border-gray-200 divide-y divide-gray-200">
                        {/* Table Headers */}
                        <div className="w-full flex divide-x divide-gray-200">
                            <TableHeader>COLUMN NAME</TableHeader>
                            <TableHeader>COLUMN ROLE</TableHeader>
                            <TableHeader>DATA TYPE</TableHeader>
                        </div>

                        {/* Rows */}
                        {
                            formatConfig && formatConfig[currentSensor] && Object.keys(formatConfig[currentSensor].dataConfig).map((cols, i) =>
                                <div className="w-full flex divide-x divide-gray-200" key={i}>
                                    <div className="flex-1/3 px-4 py-3 bg-white">{cols}</div>
                                    <ColumnRoleDropdown
                                        value={formatConfig[currentSensor].dataConfig[cols].columnRole}
                                        onSelect={(value) => updateColumnRole(currentSensor, cols, value)}
                                    />
                                    <DataTypeDropdown
                                        value={formatConfig[currentSensor].dataConfig[cols].dataType}
                                        onSelect={(value) => updateDataType(currentSensor, cols, value)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className="max-w-3xl mt-3 flex flex-col border-1 border-gray-200 divide-y divide-gray-200">
                        <div className="w-full flex divide-x divide-gray-200">
                            <TableHeader>DAILY COUNT THRESHOLD</TableHeader>
                            {formatConfig && formatConfig[currentSensor] && (
                                <ThresholdInput
                                    value={formatConfig[currentSensor].threshold}
                                    mode={formatConfig[currentSensor].thresholdMode}
                                    setThreshold={(value, mode) => updateThreshold(currentSensor, value, mode)}
                                />
                            )}
                        </div>
                    </div>
                </div>)
            }

        </div>
    )
}

/* Helper components */
function TableHeader(props: {
    children: React.ReactNode
}) {
    return (
        <div className="flex-1/3 font-medium bg-gray-50 px-4 py-3 text-gray-500">
            {props.children}
        </div>
    )
}

function TableDropdown<T>(props: {
    options: string[],
    value: string,
    onSelect: (value: T) => void
}) {
    const { options, value, onSelect } = props
    return (
        <div className="flex flex-1/3 px-2 bg-white">
            <select value={value} className="w-full px-1 py-2 shadow-none outline-none" onChange={(e) => onSelect(e.target.value as T)}>
                {
                    options.map((v, i) =>
                        <option key={i}>{v}</option>
                    )
                }
            </select>
        </div>
    )
}

function ColumnRoleDropdown(props: {
    value: string,
    onSelect: (value: ColumnRole) => void
}) {
    const { value, onSelect } = props
    return <TableDropdown options={columnRoleOptions} value={value} onSelect={onSelect} />
}

function DataTypeDropdown(props: {
    value: string,
    onSelect: (value: DataType) => void
}) {
    const { value, onSelect } = props
    return <TableDropdown options={dataTypeOptions} value={value} onSelect={onSelect} />
}

function ThresholdInput(props: {
    value: number,
    mode: ThresholdMode
    setThreshold: (value: number, mode: ThresholdMode) => void
}) {
    const { value, mode, setThreshold } = props
    const [displayedValue, setDisplayedValue] = useState('1')

    useEffect(() => {
        setDisplayedValue(value.toString())
    }, [value])

    const isValidInteger = (v: string) => {
        if (v === '') return true
        return v.match(/^\d+$/)
    }

    return (
        <div className="flex-2/3 bg-white flex content-center px-2 py-1">
            <Select
                value={mode}
                className="w-24 mr-2"
                onChange={(e) => { setThreshold(Number(displayedValue), e.target.value as ThresholdMode) }}
            >
                {
                    displayedThresholdModeOptions.map((v, i) =>
                        <option key={i}>{v}</option>
                    )
                }
            </Select>{
                (mode == 'value') && <TextInput
                    disabled={mode != 'value'}
                    value={displayedValue}
                    onChange={e => { if (isValidInteger(e.target.value)) setDisplayedValue(e.target.value) }}
                    onBlur={() => { if (displayedValue == '') setDisplayedValue('1'); setThreshold(displayedValue == '' ? 1 : Number(displayedValue), mode) }}
                    className="w-fit h-full max-w-32 outline-none my-auto"
                />
            }

        </div>
    )
}

