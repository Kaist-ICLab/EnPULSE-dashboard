import { Button, Dropdown, DropdownItem } from "flowbite-react";
import { AddAccountMode } from "@/types/account";

const AddAccountDropdown: React.FC<{ onSelect: (mode: AddAccountMode) => void }> = ({ onSelect }) => (
  <Dropdown
    dismissOnClick={true}
    placement="bottom-end"
    renderTrigger={() => (
      <Button>
        <span className="icon-[tabler--plus] mr-2"></span> Add Account
      </Button>
    )}
  >
    <DropdownItem onClick={() => onSelect("manual")}>Enter manually</DropdownItem>
    <DropdownItem onClick={() => onSelect("csv")}>Import from CSV</DropdownItem>
  </Dropdown>
);

export default AddAccountDropdown;
