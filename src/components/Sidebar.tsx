"use client";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
    const campaignId: number = 0; // TODO: Implement campaignId retrieval logic (hook)
    const pathname = usePathname();

    const isActive = (href: string) => {
        const path = pathname.split("/");
        const hrefPath = href.split("/");
        return path[3] === hrefPath[3]; // Compare [here]: /campaigns/:campaignId/[here]
    };

    const menus = [
        { name: "Dashboard", icon: "fluent-mdl2:b-i-dashboard", href: `/campaigns/${campaignId}/dashboard` },
        { name: "Messaging", icon: "mi:message-alt", href: `/campaigns/${campaignId}/messaging` },
        { name: "Settings", icon: "uil:setting", href: `/campaigns/${campaignId}/settings` },
    ];

    return <aside className="min-h-screen w-64 flex flex-col border-r border-gray-200">
        <div className="px-6 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
        <ul className="space-y-2 font-medium px-4 py-4">
            {menus.map((menu, idx) => (
                <li key={`menu-${idx}`}>
                    <a href={menu.href} className={"flex items-center p-2 text-gray-900 rounded-lg dark:text-white bg-gray-50" + (isActive(menu.href) ? " bg-gray-200" : " hover:bg-gray-100")}>
                        <Icon className="w-5 h-5 text-gray-500" icon={menu.icon} />
                        <span className="ms-3">{menu.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    </aside>
}

export default Sidebar;