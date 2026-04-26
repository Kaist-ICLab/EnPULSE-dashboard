"use client";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems, SidebarCollapse, Dropdown, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

const DashboardSidebar: React.FC = () => {
    const pathname = usePathname();

    const baseUrl = useMemo(() => {
        const id = pathname.split("/")[2];
        return `/campaigns/${id}`;
    }, [pathname]);

    const isActive = useCallback((directory: string) => {
        return pathname.startsWith(`${baseUrl}/${directory}`) || pathname.startsWith(directory);
    }, [pathname, baseUrl]);

    const settingsItems = useMemo(() => [
        { name: "General", href: `${baseUrl}/settings/general` },
        { name: "Passive Sensing", href: `${baseUrl}/settings/passive-sensing` },
        { name: "Active Sensing", href: `${baseUrl}/settings/active-sensing` },
        { name: "Triggers", href: `${baseUrl}/settings/triggers` },
    ], [baseUrl]);

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
                    <MySidebarItem isActive={isActive("dashboard")} href={`${baseUrl}/dashboard`} icon="icon-[fluent-mdl2--b-i-dashboard]" name="Campaigns" />
                    <MySidebarItem isActive={isActive("download-data")} href={`${baseUrl}/download-data`} icon="icon-[material-symbols--download]" name="Download Data" />
                    {/* <MySidebarItem isActive={isActive("messaging")} href={`${baseUrl}/messaging`} icon="icon-[mi--message-alt]" name="Messaging" /> */}
                    {collapsed ? (
                        <SettingsDropdown isActive={isActive} settingsItems={settingsItems} />
                    ) : (
                        <SidebarCollapse icon={SidebarIcon({ icon: "icon-[uil--setting]" })} label="Settings" className="text-sm">
                            {settingsItems.map((item, index) => (
                                <MySidebarItem key={index} isActive={isActive(item.href)} href={item.href} name={item.name} />
                            ))}
                        </SidebarCollapse>
                    )}
                    {/* <MySidebarItem isActive={isActive(`${baseUrl}/notification`)} href={`${baseUrl}/notification`} icon="icon-[mingcute--notification-line]" name="Notification" /> */}
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
    settingsItems: { name: string; href: string }[];
}> = ({ isActive, settingsItems }) => {
    return (
        <Dropdown
            dismissOnClick={true}
            placement="right-start"
            renderTrigger={() => (
                <SidebarItem
                    icon={SidebarIcon({ icon: "icon-[uil--setting]" })}
                    className={`text-sm hover:bg-gray-100 cursor-pointer ${isActive(`settings`) ? "bg-gray-200 hover:bg-gray-200!" : "hover:bg-gray-100"}`}
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
                    className={`${isActive(item.href) ? "bg-gray-200 hover:bg-gray-200!" : "hover:bg-gray-100"} text-sm`}
                >
                    {item.name}
                </DropdownItem>
            ))}
        </Dropdown>
    );
}

export default DashboardSidebar;