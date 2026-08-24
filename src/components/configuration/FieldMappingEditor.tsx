"use client";

import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import IconButton from "../common/IconButton";
import { Modal } from "../common/Modal";

interface FieldMappingEditorProps {
  fieldName: string;
  initialMapping: { value: string; display: string }[];
  isBitmaskMapping: boolean;
  onClose: () => void;
  onSave: (mapping: { value: string; display: string }[]) => void;
}

const FieldMappingEditor: React.FC<FieldMappingEditorProps> = ({
  fieldName,
  initialMapping,
  isBitmaskMapping,
  onClose,
  onSave,
}) => {
  const [mapping, setMapping] = useState<{ value: string; display: string }[]>(
    initialMapping ? [...initialMapping] : [],
  );

  return (
    <Modal onClose={onClose} title={`Edit Mapping - ${fieldName}`} className="max-h-[80vh] w-full max-w-2xl">
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <div className="mb-2 flex gap-2">
            <div className="flex-1 text-sm font-medium text-gray-700">{isBitmaskMapping ? "Bit Index" : "Value"}</div>
            <div className="flex-1 text-sm font-medium text-gray-700">Display</div>
            <div className="w-3"></div>
          </div>
          {mapping.map((item, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <TextInput
                value={item.value}
                type={isBitmaskMapping ? "number" : "text"}
                onChange={(e) => {
                  const newMapping = [...mapping];
                  newMapping[idx] = { ...newMapping[idx], value: e.target.value };
                  setMapping(newMapping);
                }}
                className="flex-1"
                placeholder={isBitmaskMapping ? "Bit Index" : "Value"}
              />
              <TextInput
                value={item.display}
                onChange={(e) => {
                  const newMapping = [...mapping];
                  newMapping[idx] = { ...newMapping[idx], display: e.target.value };
                  setMapping(newMapping);
                }}
                className="flex-1"
                placeholder="Display"
              />
              <IconButton
                onClick={() => {
                  const newMapping = mapping.filter((_, i) => i !== idx);
                  setMapping(newMapping);
                }}
                hoverColor="red"
                className="icon-[humbleicons--times]"
              />
            </div>
          ))}
          <Button
            color="blue"
            size="sm"
            onClick={() => setMapping([...mapping, { value: "", display: "" }])}
            className="w-full"
          >
            <span className="icon-[tabler--plus] mr-2"></span> Add Mapping
          </Button>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
        <Button
          color="blue"
          onClick={() => {
            onSave(mapping);
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default FieldMappingEditor;
