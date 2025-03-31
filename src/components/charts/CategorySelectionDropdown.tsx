import { Checkbox, Dropdown, DropdownItem } from "flowbite-react";

export default function CateogorySelectionDropdown(props: {
  uniqueElements: string[],
  categoryToIndex: { [key: string]: number },
  maxSelectedCategory: number,
  onCheckboxChanged: (categoryName: string) => void
}) {
  const { uniqueElements, categoryToIndex, maxSelectedCategory, onCheckboxChanged } = props
  const selectedCateogryCount = Object.keys(categoryToIndex).length

  return (
    <Dropdown
      label="Select Categories"
      className="m-auto min-w-40 border-gray-100 border-2 bg-white hover:bg-gray-50 text-black"
      size="sm"
    >
      <div>
        <div className={"px-4 py-2 " + (selectedCateogryCount == maxSelectedCategory ? "text-red-600" : "text-black")}>
          Selected {selectedCateogryCount} / {maxSelectedCategory}
        </div>
        <div className="max-h-40 overflow-y-auto">
          {
            uniqueElements.filter(v => v in categoryToIndex).map((value, index) =>
              <CheckboxDropdownItem
                key={index}
                checked={true}
                id={`selected-cateogry-${index}`}
                value={value}
                onCheckboxChanged={onCheckboxChanged}
              />
            )
          }
        </div>
        <div className="px-4 py-2 border-gray-100 border-t-2">Others</div>
        <div className="max-h-50 overflow-y-auto">
          {
            uniqueElements.filter(v => !(v in categoryToIndex)).map((value, index) =>
              <CheckboxDropdownItem
                key={index}
                checked={false}
                id={`unselected-cateogry-${index}`}
                value={value}
                onCheckboxChanged={onCheckboxChanged}
              />
            )
          }
        </div>
      </div>

    </Dropdown>
  )
}

function CheckboxDropdownItem(props: {
  checked: boolean,
  id: string,
  value: string,
  onCheckboxChanged: (value: string) => void
}) {
  const { checked, id, value, onCheckboxChanged } = props

  return (
    <DropdownItem onClickCapture={(e) => { e.stopPropagation(); onCheckboxChanged(value) }}>
      <Checkbox checked={checked} id={id} readOnly />
      <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value}</label>
    </DropdownItem>
  )
}