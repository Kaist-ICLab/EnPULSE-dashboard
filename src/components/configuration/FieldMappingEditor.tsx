'use client'

import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import IconButton from "../common/IconButton";
import { Modal } from "../common/Modal";

interface FieldMappingEditorProps {
    fieldName: string;
    initialMapping: { value: string, display: string }[];
    isBitmaskMapping: boolean;
    onClose: () => void;
    onSave: (mapping: { value: string, display: string }[]) => void;
}

const FieldMappingEditor: React.FC<FieldMappingEditorProps> = ({
    fieldName,
    initialMapping,
    isBitmaskMapping,
    onClose,
    onSave
}) => {
    const [mapping, setMapping] = useState<{ value: string, display: string }[]>(initialMapping ? [...initialMapping] : []);

    return (
        <Modal onClose={onClose} title={`Edit Mapping - ${fieldName}`} className="w-full max-w-2xl max-h-[80vh]">
            <div className="p-4 flex-1 overflow-auto">
                <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                        <div className="flex-1 font-medium text-sm text-gray-700">{isBitmaskMapping ? 'Bit Index' : 'Value'}</div>
                        <div className="flex-1 font-medium text-sm text-gray-700">Display</div>
                        <div className="w-3"></div>
                    </div>
                    {mapping.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 items-center">
                            <TextInput
                                value={item.value}
                                type={isBitmaskMapping ? 'number' : 'text'}
                                onChange={(e) => {
                                    const newMapping = [...mapping];
                                    newMapping[idx] = { ...newMapping[idx], value: e.target.value };
                                    setMapping(newMapping);
                                }}
                                className="flex-1"
                                placeholder={isBitmaskMapping ? 'Bit Index' : 'Value'}
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
                        onClick={() => setMapping([...mapping, { value: '', display: '' }])}
                        className="w-full"
                    >
                        <span className="icon-[tabler--plus] mr-2"></span> Add Mapping
                    </Button>
                </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
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
