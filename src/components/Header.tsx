import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const dropdownRef = useRef<HTMLInputElement>(null);
    const [campaign, setCampaign] = useState<string>("Campaign A"); // TODO: Implement hooks for retrieving (1) campagin list, (2) current campaign
    
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full h-16 flex justify-between items-center border-b border-gray-200 mx-4">
            <div ref={dropdownRef} className="flex justify-start items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <div className="text-center text-base font-normal leading-normal">{campaign}</div>
                    <Icon className="w-9 h-9" icon="material-symbols-light:arrow-drop-down" />
                </div>
                {isOpen && (
                    <div className="absolute z-10 mt-2 py-2 w-75 origin-top-right divide-y divide-gray-200 rounded-lg bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden top-4" role="menu" aria-orientation="vertical" tabIndex={-1}>
                        <div className="pb-1" role="none">
                            <a href="#" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg" role="menuitem" tabIndex={-1} id="menu-item-0">{campaign}</a> {/* TODO: Current campaign - change href into "/campagins/${campagin-id}" */}
                            <a href="/campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" role="menuitem" tabIndex={-1} id="menu-item-1">See all campaigns</a>
                            <a href="/campaigns/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" role="menuitem" tabIndex={-1} id="menu-item-2">Create a campaign</a> {/* DISCUSSION: 별도 페이지 없이 Firebase처럼 Drawer 느낌으로 만들 것인지? */}
                        </div>
                        <div role="none">
                            <div className="block mt-1 px-4 py-2 text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>Your campaigns</div> {/* TODO: Show the retrieved campaign list */}
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" role="menuitem" tabIndex={-1} id="menu-item-3">Campagin A</a> {/* TODO: change href into "/campagins/${campagin-id}" */}
                        </div>
                    </div>
                )}                   
            </div>
            <div className="w-14 flex justify-start items-center gap-4">
                <div className="p-4 rounded-2xl flex justify-center items-center gap-2">
                    <Icon className="w-6 h-6 text-gray-700" icon="mingcute:notification-line" />
                </div>
            </div>
        </div>
    );
}

export default Header;