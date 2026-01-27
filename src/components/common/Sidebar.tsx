"use client";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarCollapse, Dropdown, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { useState, useMemo } from "react";

const DashboardSidebar: React.FC = () => {
    const pathname = usePathname();

    const id = useMemo(() => {
        return parseInt(pathname.split("/")[2]);
    }, [pathname]);

    const isActive = (directory: string) => {
        const path = pathname.split("/");
        return path[3] === directory;
    };

    const [collapsed, setCollapsed] = useState(true);

    return (
        <Sidebar className="h-screen border-r-1 border-gray-300 bg-white" collapsed={collapsed}>
            <SidebarItems>
                <SidebarItemGroup className="mt-0 pt-0 border-t-0">
                    <SidebarItem key={`menu-collapse`} onClick={() => setCollapsed(!collapsed)} icon={SidebarIcon({ icon: collapsed ? "icon-[pajamas--expand-left]" : "icon-[pajamas--expand-right]" })} className={`text-sm cursor-pointer`}>
                        <span className="mr-1 align-baseline">{collapsed ? "Expand" : "Hide Sidebar"}</span>
                    </SidebarItem>
                </SidebarItemGroup>
                <SidebarItemGroup>
                    <MySidebarItem isActive={isActive("dashboard")} href={`/campaigns/${id}/dashboard`} icon="icon-[fluent-mdl2--b-i-dashboard]" name="Campaigns" />
                    <MySidebarItem isActive={isActive("messaging")} href={`/campaigns/${id}/messaging`} icon="icon-[mi--message-alt]" name="Messaging" />
                    {collapsed ? (
                        <SettingsDropdown isActive={isActive} id={id} />
                    ) : (
                        <SidebarCollapse icon={SidebarIcon({ icon: "icon-[uil--setting]" })} label="Settings">
                            <MySidebarItem isActive={isActive("general")} href={`/campaigns/${id}/settings/general`} name="General" />
                            <MySidebarItem isActive={isActive("passive-sensing")} href={`/campaigns/${id}/settings/passive-sensing`} name="Passive Sensing" />
                            <MySidebarItem isActive={isActive("active-sensing")} href={`/campaigns/${id}/settings/active-sensing`} name="Active Sensing" />
                        </SidebarCollapse>
                    )}
                    <MySidebarItem isActive={isActive("./notification")} href={`/campaigns/${id}/notification`} icon="icon-[mingcute--notification-line]" name="Notification" />
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

const SidebarIcon = (props: { icon: string }) => {
    return function IconComponent() {
        return <span className={`w-5 h-5 text-gray-500 ${props.icon} text-align-center`} />
    }
}

const MySidebarItem: React.FC<{
    isActive: boolean;
    href: string;
    icon?: string;
    name: string;
}> = ({ isActive, href, icon, name }) => {
    return <SidebarItem as={Link} href={href} icon={icon ? SidebarIcon({ icon: icon }) : () => <></>} className={` ${isActive ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-100"} text-sm`}>
        <span className="mr-1 align-baseline">{name}</span>
    </SidebarItem>
}

const SettingsDropdown: React.FC<{
    isActive: (directory: string) => boolean;
    id: number;
}> = ({ isActive, id }) => {
    const settingsItems = [
        { name: "General", href: `/campaigns/${id}/settings/general`, directory: "general" },
        { name: "Passive Sensing", href: `/campaigns/${id}/settings/passive-sensing`, directory: "passive-sensing" },
        { name: "Active Sensing", href: `/campaigns/${id}/settings/active-sensing`, directory: "active-sensing" },
    ];

    return (
        <Dropdown
            dismissOnClick={true}
            placement="right-start"
            renderTrigger={() => (
                <SidebarItem
                    icon={SidebarIcon({ icon: "icon-[uil--setting]" })}
                    className={`text-sm hover:bg-gray-100 cursor-pointer`}
                >
                    <span className="mr-1 align-baseline">Settings</span>
                </SidebarItem>
            )}
        >
            {settingsItems.map((item, index) => (
                <DropdownItem
                    key={index}
                    as={Link}
                    href={item.href}
                    className={`${isActive(item.directory) ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-100"} text-sm`}
                >
                    {item.name}
                </DropdownItem>
            ))}
        </Dropdown>
    );
}

export default DashboardSidebar;