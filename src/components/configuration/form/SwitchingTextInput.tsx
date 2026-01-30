import { useMemo, useState } from "react";
import { TextInput } from "flowbite-react";

const SwitchingTextInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    className?: string;
    sizing?: "sm" | "md" | "lg";
}> = ({ value, onChange, className = "", sizing = "md" }) => {
    const [text, setText] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    const textClassName = useMemo(() => {
        switch (sizing) {
            case "sm":
                return "text-sm";
            case "md":
                return "text-md";
            case "lg":
                return "text-lg";
        }
    }, [sizing]);

    return (
        <div className={`flex w-full gap-2 ${className}`}>
            {isEditing ? (
                <div className="flex w-full gap-2">
                    <TextInput sizing={sizing} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => { setIsEditing(false); onChange(text); }} onKeyDown={(e) => {
                        if (e.key === 'Enter') { setIsEditing(false); onChange(text); };
                        if (e.key === 'Escape') { setIsEditing(false); setText(value); };
                    }} className="grow" autoFocus />
                </div>
            ) : (
                <div className={`px-2 py-1.5 border border-transparent hover:border-gray-300 rounded-lg cursor-text min-h-[1.5rem] w-full ${textClassName}`} onClick={() => setIsEditing(true)}>
                    {value || <span className="text-gray-400">Click to edit</span>}
                </div>
            )}
        </div>
    )
}

export default SwitchingTextInput;