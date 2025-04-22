"use client";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";
import Link from "next/link";

const DashboardSidebar: React.FC = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        const path = pathname.split("/");
        const hrefPath = href.slice(2)
        return path[3] === hrefPath; // Compare [here]: /campaigns/:campaignId/[here]
    };

    const menus = [
        { name: "Dashboard", icon: "icon-[fluent-mdl2--b-i-dashboard]", href: `./dashboard` },
        { name: "Messaging", icon: "icon-[mi--message-alt]", href: `./messaging` },
        { name: "Settings", icon: "icon-[uil--setting]", href: `./settings` },
    ];

    return (
        <Sidebar>
            <SidebarLogo
                img="/logo.png"
                href="/"
            >
                Datasentry
            </SidebarLogo>
            <SidebarItems>
                <SidebarItemGroup>
                    {
                        menus.map((menu, idx) => (
                            <SidebarItem key={`menu-${idx}`} as={Link} href={menu.href} icon={SidebarIcon({ icon: menu.icon })} className={`my-2 ${isActive(menu.href) ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-100"}`}>
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