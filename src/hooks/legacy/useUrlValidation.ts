import { create } from 'zustand';

type UrlValidationState = {
  url: string;
  isValidating: boolean;
  isValid: boolean;
  message: string;
  setUrl: (url: string) => void;
  setIsValidating: (isValidating: boolean) => void;
  setIsValid: (isValid: boolean) => void;
  validateUrl: (isValid: boolean, message: string) => void;
  setMessage: (message: string) => void;
  reset: () => void;
}

const useUrlValidationStore = create<UrlValidationState>((set) => ({
  url: '',
  isValidating: false,
  isValid: false,
  message: '',
  setUrl: (url) => set({ url }),
  setIsValidating: (isValidating) => set({ isValidating }),
  setIsValid: (isValid) => set({ isValid }),
  setMessage: (message) => set({ message }),
  validateUrl: async (isValid, message) => set({ isValid, message }),
  reset: () => set({ url: '', isValidating: false, isValid: false, message: '' })
}));

export const useUrlValidation = () => {
  const url = useUrlValidationStore((s) => s.url);
  const isValidating = useUrlValidationStore((s) => s.isValidating);
  const isValid = useUrlValidationStore((s) => s.isValid);
  const message = useUrlValidationStore((s) => s.message);
  const changeUrl = useUrlValidationStore((s) => s.setUrl);
  const setIsValidating = useUrlValidationStore((s) => s.setIsValidating);
  const setIsValid = useUrlValidationStore((s) => s.setIsValid);
  const setMessage = useUrlValidationStore((s) => s.setMessage);
  const checkUrl = useUrlValidationStore((s) => s.validateUrl);
  const reset = useUrlValidationStore((s) => s.reset);

  const setUrl = (url: string) => {
    changeUrl(url);
  };

  const validateUrl = async (isValid: boolean, message: string) => {
    // Basic URL format validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const isValidFormat = urlPattern.test(url);

    if (!isValidFormat) {
      checkUrl(false, 'DNS error - No response');
    }

    setIsValidating(true);
    setMessage('DNS check in progress');

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
      checkUrl(result.isValid, result.message);
    } catch (error) {
      checkUrl(false, 'DNS error - No response');
    } finally {
      setIsValidating(false);
    }
  };

  return {
    url,
    isValidating,
    isValid,
    message,
    setUrl,
    setIsValidating,
    setIsValid,
    setMessage,
    validateUrl,
    reset
  };
};
export default useUrlValidation;