'use client'
import React from 'react';
import { TextInput, Spinner, Button } from 'flowbite-react';
import { useFileValidation } from '@/hooks/useFileValidation';

const FileValidator: React.FC = () => {
  const {
    fileName,
    selectFile,
    isValidating,
    selectedFile,
    checkValid,
    isValid,
    message
  } = useFileValidation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0], event.target.files?.[0]?.name ?? '');
  };

  const handleValidate = async () => {
    if (!selectedFile) return;
    await checkValid(isValid, message);
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
            onChange={handleFileSelect}
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
          onClick={handleValidate}
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