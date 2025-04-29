'use client'
import React, { useState } from 'react';
import { TextInput, Spinner, Button } from 'flowbite-react';
import { useUrlValidation } from '@/hooks/legacy/useUrlValidation';

const UrlValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const { setUrl, isValidating, validateUrl, isValid, message } = useUrlValidation();

  const handleValidate = async () => {
    setUrl(input);
    await validateUrl(isValid, message);
  };

  return (
    <div className="flex-1">
      <div className="flex gap-2">
        <TextInput
          type="text"
          placeholder="Enter URL to validate"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-[421px]"
        />
        <Button 
          onClick={handleValidate}
          disabled={!input || isValidating}
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

export default UrlValidator; 