'use client'

import { Button, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";

interface FieldMappingEditorProps {
    fieldName: string;
    initialMapping: { value: string, display: string }[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (mapping: { value: string, display: string }[]) => void;
}

const FieldMappingEditor: React.FC<FieldMappingEditorProps> = ({
    fieldName,
    initialMapping,
    isOpen,
    onClose,
    onSave
}) => {
    const [mapping, setMapping] = useState<{ value: string, display: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            setMapping(initialMapping ? [...initialMapping] : []);
        }
    }, [isOpen, initialMapping]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-4 bg-gray-100 rounded-t-lg flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Edit Mapping - {fieldName}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <span className="icon-[humbleicons--times] w-5 h-5 cursor-pointer"></span>
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                    <div className="mb-4">
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1 font-medium text-sm text-gray-700">Value</div>
                            <div className="flex-1 font-medium text-sm text-gray-700">Display</div>
                            <div className="w-10"></div>
                        </div>
                        {mapping.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <TextInput
                                    value={item.value}
                                    onChange={(e) => {
                                        const newMapping = [...mapping];
                                        newMapping[idx] = { ...newMapping[idx], value: e.target.value };
                                        setMapping(newMapping);
                                    }}
                                    className="flex-1"
                                    placeholder="Value"
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
                                <button
                                    onClick={() => {
                                        const newMapping = mapping.filter((_, i) => i !== idx);
                                        setMapping(newMapping);
                                    }}
                                    className="w-10 flex items-center justify-center text-gray-500 hover:text-red-500 cursor-pointer"
                                >
                                    <span className="icon-[humbleicons--times] w-4 h-4"></span>
                                </button>
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
                        color="gray"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="blue"
                        onClick={() => {
                            onSave(mapping);
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FieldMappingEditor;
