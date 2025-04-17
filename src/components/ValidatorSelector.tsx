'use client'
import React, { useState } from 'react';
import { Select, Alert } from 'flowbite-react';
import FileValidator from './FileValidator';
import UrlValidator from './UrlValidator';

type ValidatorType = 'url' | 'file';

interface ValidatorSelectorProps {
  onValidFile?: (file: File) => void;
  onValidUrl?: (url: string) => void;
}

const ValidatorSelector: React.FC<ValidatorSelectorProps> = ({ onValidUrl, onValidFile }) => {
  const [type, setType] = useState<ValidatorType>('url');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    isProgress?: boolean;
  } | null>(null);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as ValidatorType);
    setValidationResult(null);
  };

  const getValidationMessage = () => {
    if (!validationResult) return null;
    
    if (validationResult.isProgress) {
      return type === 'file' ? 'DB parsing in progress' : 'DNS check in progress';
    }

    if (validationResult.isValid) {
      return type === 'file' ? 'DB parsed successfully' : 'DNS check successful';
    }

    return type === 'file' ? 'DB has not intended format' : 'DNS error - No response';
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;

    if (validationResult.isProgress) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
      );
    }

    if (validationResult.isValid) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div>
      {type === 'url' ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Select
              value={type}
              onChange={handleTypeChange}
              className="w-32"
            >
              <option value="url">URL-based</option>
              <option value="file">File-based</option>
            </Select>
            <UrlValidator 
              onValidUrl={onValidUrl}
              onValidationResult={setValidationResult}
            />
          </div>
          {validationResult && (
            <div className={`flex items-center gap-2 text-sm ${validationResult.isValid ? 'text-green-500' : validationResult.isProgress ? 'text-yellow-600' : 'text-red-500'}`}>
              {getValidationIcon()}
              <span>{getValidationMessage()}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Select
              value={type}
              onChange={handleTypeChange}
              className="w-32"
            >
              <option value="url">URL-based</option>
              <option value="file">File-based</option>
            </Select>
            <FileValidator 
              onValidFile={onValidFile}
              onValidationResult={setValidationResult}
            />
          </div>
          {validationResult && (
            <div className={`flex items-center gap-2 text-sm ${validationResult.isValid ? 'text-green-500' : validationResult.isProgress ? 'text-yellow-600' : 'text-red-500'}`}>
              {getValidationIcon()}
              <span>{getValidationMessage()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidatorSelector; 