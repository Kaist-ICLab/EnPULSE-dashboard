import { Icon } from "@iconify/react";


const Header: React.FC = () => (
    <div className="w-full h-16 flex justify-between items-center border-b border-gray-200">
        <div className="flex justify-start items-center gap-2">
            <div className="px-4 py-2 rounded-xl flex justify-center items-center gap-2">
                <div className="text-center text-gray-700 text-base font-normal leading-normal">Campaign A</div>
                <Icon className="w-9 h-9" icon="material-symbols-light:arrow-drop-down" />
            </div>
        </div>
        <div className="w-14 flex justify-start items-center gap-4">
            <div className="p-4 rounded-2xl flex justify-center items-center gap-2">
                <Icon className="w-6 h-6 text-gray-700" icon="mingcute:notification-line" />
            </div>
        </div>
    </div>
)

export default Header;