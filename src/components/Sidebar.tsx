"use client";
import useCampaigns from "@/hooks/useCampaigns";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";

const DashboardSidebar: React.FC = () => {
    const { campaignId } = useCampaigns();
    const pathname = usePathname();

    const isActive = (href: string) => {
        const path = pathname.split("/");
        const hrefPath = href.split("/");
        return path[3] === hrefPath[3]; // Compare [here]: /campaigns/:campaignId/[here]
    };

    const menus = [
        { name: "Dashboard", icon: "icon-[fluent-mdl2--b-i-dashboard]", href: `/campaigns/${campaignId}/dashboard` },
        { name: "Messaging", icon: "icon-[mi--message-alt]", href: `/campaigns/${campaignId}/messaging` },
        { name: "Settings", icon: "icon-[uil--setting]", href: `/campaigns/${campaignId}/settings` },
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
                            <SidebarItem key={`menu-${idx}`} icon={SidebarIcon({ icon: menu.icon })} href={menu.href} className={isActive(menu.href) ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-100"}>
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