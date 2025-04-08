'use client'

import { Button, Dropdown, DropdownItem, TextInput } from "flowbite-react"
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

export default function FormatConfigTable(props: {
  config: { [key: string]: FormatConfig }
  onConfigSave: (sensorName: string, config: FormatConfig) => void
}) {
  const { config, onConfigSave } = props

  const [currentSensor, setCurrentSensor] = useState(Object.keys(config)[0])
  // Deep clone: seperate actual config from config change ongoing
  const [currentConfig, setCurrentConfig] = useState(structuredClone(config[currentSensor]))
  const [hasSomethingToSave, setHasSomethingToSave] = useState(false)

  useEffect(() => {
    setCurrentConfig(structuredClone(config[currentSensor]))
    setHasSomethingToSave(false)
  }, [config, currentSensor])


  const updateCurrentConfig = (config: FormatConfig) => {
    setCurrentConfig({ ...config })
    setHasSomethingToSave(true)
  }

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-xl">Format Configuration</h2>
      <div className="w-full py-1 mb-4 flex">
        <Dropdown
          label={currentSensor}
          className="border-gray-300 border-1 bg-white hover:bg-gray-50 text-black"
          size="lg"
        >
          {
            Object.keys(config).map((v, i) =>
              <DropdownItem key={i} onClick={() => { setCurrentSensor(v) }}>{v}</DropdownItem>
            )
          }
        </Dropdown>
        <div className="w-2"></div>
        <Button className="transition-opacity duration-100" onClick={() => onConfigSave(currentSensor, currentConfig)} disabled={!hasSomethingToSave} size="lg">Save</Button>
      </div>
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
            Object.keys(currentConfig.dataConfig).map((cols, i) =>
              <div className="w-full flex divide-x divide-gray-200" key={i}>
                <div className="flex-1/3 p-4 bg-white">{cols}</div>
                <ColumnRoleDropdown value={currentConfig.dataConfig[cols].columnRole} onSelect={(value) => { currentConfig.dataConfig[cols].columnRole = value; updateCurrentConfig(currentConfig) }} />
                <DataTypeDropdown value={currentConfig.dataConfig[cols].dataType} onSelect={(value) => { currentConfig.dataConfig[cols].dataType = value; updateCurrentConfig(currentConfig) }} />
              </div>
            )
          }
        </div>
        <div className="max-w-3xl mt-3 flex flex-col border-1 border-gray-200 divide-y divide-gray-200">
          <div className="w-full flex divide-x divide-gray-200">
            <TableHeader>DAILY COUNT THRESHOLD</TableHeader>
            <ThresholdInput
              value={currentConfig.threshold}
              mode={currentConfig.thresholdMode}
              setThreshold={(value, mode) => { currentConfig.threshold = value; currentConfig.thresholdMode = mode; updateCurrentConfig(currentConfig) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Helper components */
function TableHeader(props: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1/3 font-medium bg-gray-50 p-4 text-gray-500">
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
    <div className="flex-1/3 p-2 bg-white">
      <select value={value} className="w-full p-2 shadow-none outline-none" onChange={(e) => onSelect(e.target.value as T)}>
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
    <div className="flex-2/3 bg-white flex content-center p-2">
      <Dropdown
        label={mode}
        className="border-gray-300 border-1 bg-white hover:bg-gray-50 text-black mr-2"
      >
        {
          displayedThresholdModeOptions.map((v, i) =>
            <DropdownItem key={i} onClick={() => { setThreshold(Number(displayedValue), v) }}>{v}</DropdownItem>)
        }
      </Dropdown>{
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

