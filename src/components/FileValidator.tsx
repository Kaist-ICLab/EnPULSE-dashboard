'use client'
import React, { useState } from 'react';
import { TextInput, Spinner, Button } from 'flowbite-react';

interface FileValidatorProps {
  onValidFile?: (file: File) => void;
  onValidationResult?: (result: { isValid: boolean; message: string; isProgress?: boolean; } | null) => void;
}

const FileValidator: React.FC<FileValidatorProps> = ({ onValidFile, onValidationResult }) => {
  const [fileName, setFileName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.db')) {
        onValidationResult?.({
          isValid: false,
          message: 'DB has not intended format',
        });
        setFileName('');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      onValidationResult?.(null);
    }
  };

  const simulateFileCheck = async () => {
    if (!selectedFile) return;

    setIsValidating(true);
    onValidationResult?.({
      isValid: false,
      message: 'DB parsing in progress',
      isProgress: true
    });

    try {
      // Simulate file check delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock file check results
      const mockResults = [
        { isValid: true, message: 'DB parsed successfully' },
        { isValid: false, message: 'DB has not intended format' }
      ];

      // Randomly select a result for demonstration
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      onValidationResult?.(result);

      if (result.isValid && onValidFile) {
        onValidFile(selectedFile);
      }
    } catch (error) {
      onValidationResult?.({
        isValid: false,
        message: 'DB has not intended format',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex gap-2">
        <div className="flex">
          <Button
            onClick={() => document.getElementById('fileInput')?.click()}
            disabled={isValidating}
            className="rounded-r-none border-r-0 h-[42px]"
          >
            Choose File
          </Button>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            accept=".db"
          />
          <div>
            <TextInput
              type="text"
              placeholder="No file chosen, choose .db file to upload"
              value={fileName}
              readOnly
              className="w-[421px] [&>div>input]:rounded-l-none [&>div>input]:border-l-0"
            />
          </div>
        </div>
        <Button 
          onClick={simulateFileCheck}
          disabled={!selectedFile || isValidating}
          className="whitespace-nowrap"
        >
          {isValidating ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Checking...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileValidator; 