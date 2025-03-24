import { Icon } from "@iconify/react";

const Sidebar = () => {
    const menus = [
        { name: "Dashboard", icon: "fluent-mdl2:b-i-dashboard" },
        { name: "Messaging", icon: "mi:message-alt" },
        { name: "Settings", icon: "uil:setting" }
    ];

    return <aside className="min-h-screen bg-gray-50 w-64 flex flex-col border-r border-gray-200">
        <div className="px-6 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
        <ul className="space-y-2 font-medium px-4 py-4">
            {menus.map((menu, idx) => (
                <li key={`menu-${idx}`}>
                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                        <Icon className="w-5 h-5 text-gray-500" icon={menu.icon} />
                        <span className="ms-3">{menu.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    </aside>
}

export default Sidebar;