import { Dispatch, SetStateAction, useRef, useState } from "react";

import useEmailAutoComplete from "@/hooks/messaging/useEmailAutoComplete";
import { CampaignParticipant } from "@/types/campaign";

const EmailAutocompleteInput: React.FC<{
    sendTo: CampaignParticipant[];
    setSendTo: Dispatch<SetStateAction<CampaignParticipant[]>>;
}> = ({ sendTo, setSendTo }) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { suggestions, addSendTo, focusIndex, setFocusIndex } = useEmailAutoComplete(value, sendTo, setSendTo, () => { setValue(''); inputRef.current?.focus(); });

    return (
        <div className="relative">
            <div className="w-fullborder px-1 pt-1 border-1 border-gray-300 rounded-md">
                {
                    sendTo.map(p => (
                        <div key={p.email} className="w-fit inline-flex items-center gap-1 px-3 py-1 mr-1 mb-1 bg-gray-100 hover:bg-gray-200 rounded-2xl cursor-pointer" onClick={() => setSendTo(prev => prev.filter(v => v.email !== p.email))}>
                            <span className="icon-[humbleicons--times] text-gray-600" />
                            {p.email}
                        </div>
                    ))
                }
                <input
                    type="text"
                    placeholder="To"
                    ref={inputRef}
                    value={value}
                    className="grow pl-1 mb-1 focus:outline-none shadow-none"
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Tab') {
                            e.preventDefault();
                            if (suggestions.length == 1) {
                                addSendTo(suggestions[0]);
                            } else if (focusIndex !== -1) {
                                addSendTo(suggestions[focusIndex]);
                            }
                        }

                        if (e.key === 'ArrowDown') {
                            setFocusIndex(v => Math.min(v + 1, suggestions.length - 1));
                        }

                        if (e.key === 'ArrowUp') {
                            setFocusIndex(v => Math.max(v - 1, -1));
                        }

                        if (e.key === 'Backspace') {
                            if (value.length === 0) {
                                setSendTo(prev => prev.slice(0, -1));
                            }
                        }
                    }}
                />
            </div>

            {
                suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md max-h-64 overflow-y-auto border-1 border-gray-200 overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                            <div key={suggestion.email} className={`p-2 hover:bg-gray-100 cursor-pointer ${focusIndex === index ? 'bg-gray-100' : ''}`} onClick={() => { addSendTo(suggestion); }}>{suggestion.email}</div>
                        ))}
                    </div>
                )
            }
        </div>
    )
};

export default EmailAutocompleteInput;
