import React, { useState } from 'react';
import { Select } from 'flowbite-react';
import FileValidator from './FileValidator';
import UrlValidator from '../settings/UrlValidator';
import Section from '@/components/common/Section';
import { useFileValidation } from '@/hooks/legacy/useFileValidation';
import { useUrlValidation } from '@/hooks/legacy/useUrlValidation';

type ValidatorType = 'url' | 'file';

const DatabaseConnection: React.FC = () => {
  const [type, setType] = useState<ValidatorType>('url');
  const { fileName, isValid: isValidFile, isValidating: isValidatingFile, message: messageFile, reset: resetFile } = useFileValidation();
  const { url, isValid: isValidUrl, isValidating: isValidatingUrl, message: messageUrl, reset: resetUrl } = useUrlValidation();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as ValidatorType);
    resetFile();
    resetUrl();
  };

  const isValid = type === 'file' ? fileName.length > 0 : url.length > 0;
  const validationStatus = type === 'file' ? isValidFile : isValidUrl;
  const progressStatus = type === 'file' ? isValidatingFile : isValidatingUrl;

  const getValidationIcon = () => {
    if (!isValid) return null;    

    if (progressStatus) {
      return <img src="/loadingIcon.svg" alt="Loading" className="w-4 h-4" />;
    }

    if (validationStatus) {
      return <img src="/successIcon.svg" alt="Success" className="w-4 h-4" />;
    }

    return <img src="/failIcon.svg" alt="Error" className="w-4 h-4" />;
  };

  const getMessage = () => {
    if (type === 'file') return messageFile;
    return messageUrl;
  };

  return (
    <Section title="Database">
      <div>
        <h6 className="text-base font-medium text-gray-900 mb-2">
          Database Connection
        </h6>
        <div>
          <div className="flex flex-col gap-2"> 
            {type === 'url' ? (
              <div className="flex gap-2 items-center">
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-32"
                >
                  <option value="url">URL-based</option>
                  <option value="file">File-based</option>
                </Select>
                <UrlValidator />
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-32"
                >
                  <option value="url">URL-based</option>
                  <option value="file">File-based</option>
                </Select>
                <FileValidator />
              </div>
            )}
          </div>
          {isValid && (
            <div className={`flex items-center gap-2 text-sm ${validationStatus ? 'text-green-500' : progressStatus ? 'text-yellow-600' : 'text-red-500'}`}>
              {getValidationIcon()}
              <span>{getMessage()}</span>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default DatabaseConnection; 