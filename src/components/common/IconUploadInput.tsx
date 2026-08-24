"use client";
import { useRef, useState } from "react";
import { Spinner } from "flowbite-react";
import { getWebappIconUrl, uploadWebappIcon } from "@/services/storageService";
import { notify } from "@/utils/notify";

const MAX_ICON_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const IconUploadInput: React.FC<{
  /** Storage path (bucket-relative object key) of the current icon, if any - not a full URL. */
  value: string | null | undefined;
  /** Called with the newly uploaded icon's storage path. */
  onChange: (iconPath: string) => void;
  size?: "sm" | "md";
}> = ({ value, onChange, size = "md" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const sizeClass = size === "sm" ? "w-10 h-10" : "w-16 h-16";
  const iconUrl = value ? getWebappIconUrl(value) : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Invalid icon", "Please choose an image file.");
      return;
    }
    if (file.size > MAX_ICON_SIZE_BYTES) {
      notify.error("Icon too large", "Please choose an image under 2MB.");
      return;
    }

    setIsUploading(true);
    const result = await uploadWebappIcon(file);
    setIsUploading(false);

    if (!result.ok) {
      notify.error("Failed to upload icon", result.error);
      return;
    }
    onChange(result.data);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={`relative flex items-center justify-center ${sizeClass} shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100`}
        aria-label={value ? "Change icon" : "Upload icon"}
      >
        {isUploading ? (
          <Spinner size="sm" />
        ) : iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="Web app icon" className="h-full w-full object-cover" />
        ) : (
          <span className="icon-[tabler--photo-plus] h-6 w-6 text-gray-400"></span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default IconUploadInput;
