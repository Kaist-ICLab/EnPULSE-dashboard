import { create } from 'zustand';

type FileValidationState = {
  fileName: string;
  isValidating: boolean;
  isValid: boolean;
  message: string;
  selectedFile: File | null;
  selectFile: (file: File | null, fileName: string) => void;
  setIsValidating: (isValidating: boolean) => void;
  setIsValid: (isValid: boolean) => void;
  setMessage: (message: string) => void;
  checkValid: (isValid: boolean, message: string) => void;
  reset: () => void;
}

const useFileValidationStore = create<FileValidationState>((set) => ({
  fileName: '',
  isValidating: false,
  isValid: false,
  message: '',
  selectedFile: null,
  selectFile: (file, fileName) => set({ fileName, selectedFile: file }),
  setIsValidating: (isValidating) => set({ isValidating }),
  setIsValid: (isValid) => set({ isValid: isValid }),
  setMessage: (message) => set({ message }),
  checkValid: async (isValid, message) => set({ isValid, message }),
  reset: () => set({ fileName: '', isValidating: false, isValid: false, message: '', selectedFile: null })
}));

export const useFileValidation = () => {
  const fileName = useFileValidationStore((s) => s.fileName);
  const isValidating = useFileValidationStore((s) => s.isValidating);
  const isValid = useFileValidationStore((s) => s.isValid);
  const message = useFileValidationStore((s) => s.message);
  const selectedFile = useFileValidationStore((s) => s.selectedFile);
  const changeFile = useFileValidationStore((s) => s.selectFile);
  const setIsValidating = useFileValidationStore((s) => s.setIsValidating);
  const setIsValid = useFileValidationStore((s) => s.setIsValid);
  const setMessage = useFileValidationStore((s) => s.setMessage);
  const doValidation = useFileValidationStore((s) => s.checkValid);
  const reset = useFileValidationStore((s) => s.reset);
  const selectFile = (file: File | undefined, filename: string) => {    if (file) {
    if (!file.name.toLowerCase().endsWith('.db')) {
        setIsValid(false);
        setMessage('DB has not intended format');
      }
      changeFile(file, file.name);
    }
  };
  
  const checkValid = async (isValid: boolean, message: string) => {
    if (!selectedFile) return null;

    setIsValidating(true);
    setMessage('DB parsing in progress');

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
      doValidation(result.isValid, result.message);
    } catch (error) {
      doValidation(false, 'DB has not intended format');
    } finally {
      setIsValidating(false);
    }
  };
  
  return {
    fileName,
    isValidating,
    isValid,
    message,
    selectedFile,
    selectFile,
    setIsValidating,
    setIsValid,
    setMessage,
    checkValid,
    reset
  };
};
export default useFileValidation;