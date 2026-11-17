import { useRef } from "react";
import { Button } from "flowbite-react";

const CsvFilePicker: React.FC<{ fileName: string | null; onSelect: (file: File) => void }> = ({
  fileName,
  onSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <Button color="light" onClick={() => fileInputRef.current?.click()}>
        <span className="icon-[material-symbols--upload-file] mr-2 h-5 w-5" />
        {fileName ? "Choose another file" : "Choose CSV file"}
      </Button>
      {fileName && <span className="truncate text-sm text-gray-700">{fileName}</span>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          // Allow choosing the same file again after fixing it.
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default CsvFilePicker;
