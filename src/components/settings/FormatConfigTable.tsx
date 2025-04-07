'use client'

import { Button, Dropdown, DropdownItem, TextInput } from "flowbite-react"
import React, { Fragment, useState } from "react"

export type ColumnRole = 'timestamp' | 'ignore' | 'uid' | 'data'
export type DataType = 'datetime' | 'categorical' | 'timedelta' | 'numerical'

type FormatConfigEntry = {
  columnRole: ColumnRole,
  dataType: DataType
  threshold: number,
}

export type FormatConfig = { [key: string]: FormatConfigEntry }

const columnRoleOptions: ColumnRole[] = ['timestamp', 'uid', 'data', 'ignore']
const dataTypeOptions: DataType[] = ['datetime', 'categorical', 'timedelta', 'numerical']

export default function FormatConfigTable(props: {
  config: { [key: string]: FormatConfig }
}) {
  const { config } = props

  const [currentSensor, setCurrentSensor] = useState(Object.keys(config)[0])

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-lg">Format Configuration</h2>
      <div className="w-full py-1 mb-2 flex">
        <Dropdown label={currentSensor}>
          {
            Object.keys(config).map((v, i) =>
              <DropdownItem key={i} onClick={() => setCurrentSensor(v)}>{v}</DropdownItem>
            )
          }
        </Dropdown>
        <div className="w-2"></div>
        <Button>Save</Button>
      </div>
      <div className="w-full">
        <div className="max-w-3xl grid grid-cols-4 border-gray-200 border-1 divide-x  divide-y divide-gray-200">
          {/* Table Headers */}
          <TableHeader>Column Name</TableHeader>
          <TableHeader>Column Role</TableHeader>
          <TableHeader>Data Type</TableHeader>
          <TableHeader>Threshold</TableHeader>
          {/* Rows */}
          {
            Object.keys(config[currentSensor]).map((cols, i) =>
              <Fragment key={i}>
                <div className="p-4">{cols}</div>
                <ColumnRoleDropdown />
                <DataTypeDropdown />
                <DelayedInput />
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

function TableDropdown(props: {
  options: string[],
}) {
  const { options } = props
  return (
    <div className="p-2">
      <select className="w-full p-2 shadow-none outline-none">
        {
          options.map((v, i) =>
            <option key={i}>{v}</option>
          )
        }
      </select>
    </div>

  )
}

function ColumnRoleDropdown(

) {
  return <TableDropdown options={columnRoleOptions} />
}

function DataTypeDropdown(

) {
  return <TableDropdown options={dataTypeOptions} />
}

function DelayedInput() {
  return (
    <div>
      <input className="w-full h-full p-4 outline-none">
      </input>
    </div>
  )
}

