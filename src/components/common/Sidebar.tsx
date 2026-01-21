"use client";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";

const DashboardSidebar: React.FC = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        const path = pathname.split("/");
        const hrefPath = href.slice(2)
        return path[3] === hrefPath; // Compare [here]: /campaigns/:campaignId/[here]
    };

    const [collapsed, setCollapsed] = useState(true);

    const menus = [
        { name: "Dashboard", icon: "icon-[fluent-mdl2--b-i-dashboard]", href: `./dashboard` },
        { name: "Messaging", icon: "icon-[mi--message-alt]", href: `./messaging` },
        { name: "Settings", icon: "icon-[uil--setting]", href: `./settings` },
        { name: "Notification", icon: "icon-[mingcute--notification-line]", href: `./` },
    ];

    return (
        <Sidebar className="h-screen border-r-1 border-gray-300 bg-white" collapsed={collapsed}>
            <SidebarItems>
                <SidebarItemGroup className="mt-0 pt-0 border-t-0">
                    <SidebarItem key={`menu-collapse`} onClick={() => setCollapsed(!collapsed)} icon={SidebarIcon({ icon: collapsed ? "icon-[pajamas--expand-left]" : "icon-[pajamas--expand-right]" })} className={`text-sm cursor-pointer`}>
                        <span className="mr-1 align-baseline">{collapsed ? "Expand" : "Hide Sidebar"}</span>
                    </SidebarItem>
                </SidebarItemGroup>
                <SidebarItemGroup>
                    {
                        menus.map((menu, idx) => (
                            <SidebarItem key={`menu-${idx}`} as={Link} href={menu.href} icon={SidebarIcon({ icon: menu.icon })} className={` ${isActive(menu.href) ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-100"} text-sm`}>
                                <span className="mr-1 align-baseline">{menu.name}</span>
                            </SidebarItem>
                        ))
                    }
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

function SidebarIcon(props: {
    icon: string;
}) {
    const { icon } = props;
    return function IconComponent() {
        return <span className={`w-5 h-5 text-gray-500 ${icon} text-align-center`} />;
    };
}

export default DashboardSidebar;