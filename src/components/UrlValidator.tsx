'use client'
import React, { useState } from 'react';
import { TextInput, Spinner, Button } from 'flowbite-react';

interface UrlValidatorProps {
  onValidUrl?: (url: string) => void;
  onValidationResult?: (result: { isValid: boolean; message: string; isProgress?: boolean; } | null) => void;
}

const UrlValidator: React.FC<UrlValidatorProps> = ({ onValidUrl, onValidationResult }) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateUrl = async () => {
    if (!url) return;

    // Basic URL format validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const isValidFormat = urlPattern.test(url);

    if (!isValidFormat) {
      onValidationResult?.({
        isValid: false,
        message: 'DNS error - No response',
      });
      return;
    }

    setIsValidating(true);
    onValidationResult?.({
      isValid: false,
      message: 'DNS check in progress',
      isProgress: true
    });

    try {
      // Simulate URL check delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock URL check results
      const mockResults = [
        { isValid: true, message: 'DNS check successful' },
        { isValid: false, message: 'DNS error - No response' }
      ];

      // Randomly select a result for demonstration
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      onValidationResult?.(result);

      if (result.isValid && onValidUrl) {
        onValidUrl(url);
      }
    } catch (error) {
      onValidationResult?.({
        isValid: false,
        message: 'DNS error - No response',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex gap-2">
        <TextInput
          type="text"
          placeholder="Enter URL to validate"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-[421px]"
        />
        <Button 
          onClick={validateUrl}
          disabled={!url || isValidating}
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