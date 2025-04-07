'use client'

import { Button, Dropdown, DropdownItem } from "flowbite-react"
import React, { Fragment, useEffect, useState } from "react"

export type ColumnRole = 'timestamp' | 'ignore' | 'uid' | 'data'
export type DataType = 'datetime' | 'categorical' | 'timedelta' | 'numerical'

type FormatConfigEntry = {
  columnRole: ColumnRole,
  dataType: DataType
}

export type FormatConfig = { threshold: number, dataConfig: { [key: string]: FormatConfigEntry } }

const columnRoleOptions: ColumnRole[] = ['timestamp', 'uid', 'data', 'ignore']
const dataTypeOptions: DataType[] = ['datetime', 'categorical', 'timedelta', 'numerical']

export default function FormatConfigTable(props: {
  config: { [key: string]: FormatConfig }
  onConfigSave: (sensorName: string, config: FormatConfig) => void
}) {
  const { config, onConfigSave } = props

  const [currentSensor, setCurrentSensor] = useState(Object.keys(config)[0])
  // Deep clone: seperate actual config from config change ongoing
  const [currentConfig, setCurrentConfig] = useState(structuredClone(config[currentSensor]))

  useEffect(() => {
    setCurrentConfig(structuredClone(config[currentSensor]))
  }, [config, currentSensor])

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-xl">Format Configuration</h2>
      <div className="w-full py-1 mb-2 flex">
        <Dropdown
          label={currentSensor}
          className="border-gray-200 border-2 bg-white hover:bg-gray-50 text-black"
          size="lg"
        >
          {
            Object.keys(config).map((v, i) =>
              <DropdownItem key={i} onClick={() => setCurrentSensor(v)}>{v}</DropdownItem>
            )
          }
        </Dropdown>
        <div className="w-2"></div>
        <Button onClick={() => onConfigSave(currentSensor, currentConfig)} size="lg">Save</Button>
      </div>
      <div className="w-full">
        <div className="max-w-3xl grid grid-cols-3 border-gray-200 border-1 divide-x  divide-y divide-gray-200">
          {/* Table Headers */}
          <TableHeader>Column Name</TableHeader>
          <TableHeader>Column Role</TableHeader>
          <TableHeader>Data Type</TableHeader>
          {/* Rows */}
          {
            Object.keys(currentConfig.dataConfig).map((cols, i) =>
              <Fragment key={i}>
                <div className="p-4 bg-white">{cols}</div>
                <ColumnRoleDropdown value={currentConfig.dataConfig[cols].columnRole} onSelect={(value) => { currentConfig.dataConfig[cols].columnRole = value; setCurrentConfig({ ...currentConfig }) }} />
                <DataTypeDropdown value={currentConfig.dataConfig[cols].dataType} onSelect={(value) => { currentConfig.dataConfig[cols].dataType = value; setCurrentConfig({ ...currentConfig }) }} />
              </Fragment>
            )
          }
        </div>
      </div>
    </div>
  )
}

function TableHeader(props: {
  children: React.ReactNode
}) {
  return (
    <div className="font-medium bg-gray-50 p-4 text-gray-500">
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
    <div className="p-2 bg-white">
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

// function DelayedInput(props: {
//   value: number,
// }) {
//   const { value } = props
//   const [lastValidValue, setLastValidValue] = useState(value)

//   return (
//     <div className="bg-white">
//       <input value={value} className="w-full h-full p-4 outline-none">
//       </input>
//     </div>
//   )
// }

