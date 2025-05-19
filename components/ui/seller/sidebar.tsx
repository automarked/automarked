"use client";

import { IUser } from "@/models/user";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Bell, Scroll, Users, ChevronRight, ChevronDown, X, LogOut, HelpCircle, Globe } from "lucide-react";
import { FaCar, FaComment } from "react-icons/fa";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useUser } from "@/contexts/userContext";
import Image from "next/image";
import { useChatContext } from "@/contexts/chatContext";
import { useEffect, useState } from "react";
import useSupportId from "@/hooks/useSupportedId";

const Sidebar: React.FC<{ currentProfile: IUser; isOpen: boolean, closeSidebar: () => void }> = ({ currentProfile, isOpen, closeSidebar }) => {
    const { unreadMessagesCount, unreadNotifications } = useNotificationContext();
    const { getUnreadMessagesCount, unreadMessagesCount: unreadMessagesCountContext } = useChatContext();
    const { supportId } = useSupportId();
    const { imageURL } = useUser(currentProfile.userId);
    
    const [expandedGroups, setExpandedGroups] = useState({
        "Tempo Real": true,
        "Automarked": false,
    });

    useEffect(() => {
        getUnreadMessagesCount();
    }, [unreadMessagesCount, getUnreadMessagesCount]);

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName as keyof typeof expandedGroups]: !prev[groupName as keyof typeof expandedGroups]
        }));    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[998] md:hidden"
                    onClick={closeSidebar}
                />
            )}
            
            <div
                data-open={isOpen}
                className={`fixed top-0 z-[999] left-0 h-screen w-64 bg-[#1e293b] text-white transform transition-transform duration-300 ease-in-out data-[open=true]:translate-x-0 data-[open=false]:-translate-x-full md:translate-x-0 md:static flex flex-col`}
            >
                {/* Mobile close button */}
                <button
                    onClick={closeSidebar}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-700 md:hidden"
                >
                    <X size={20} />
                </button>
                
                {/* User Profile */}
                <div className="flex flex-col items-center py-6 border-b border-gray-700">
                    <Image
                        src={imageURL}
                        width={200}
                        height={200}
                        alt="User"
                        className="w-20 h-20 object-cover rounded-full border-2 border-white"
                    />
                    <h2 className="mt-3 font-semibold text-lg">{currentProfile.companyName}</h2>
                    <p className="text-sm text-gray-400">{currentProfile.email}</p>
                </div>
                
                {/* Main Menu */}
                <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto">
                    <SidebarItem 
                        closeSidebar={closeSidebar} 
                        icon={<BarChart2 />} 
                        label="Dashboard" 
                        link="/seller" 
                    />
                    <SidebarItem 
                        closeSidebar={closeSidebar} 
                        icon={<FaCar />} 
                        label="Inventário" 
                        link="/seller/inventory" 
                    />
                    {currentProfile.type === "seller" && (
                        <SidebarItem 
                            closeSidebar={closeSidebar} 
                            icon={<Users />} 
                            label="Comerciais" 
                            link="/seller/account-settings" 
                        />
                    )}
                    
                    <SidebarGroup
                        title="Tempo Real"
                        expanded={expandedGroups["Tempo Real"]}
                        onToggle={() => toggleGroup("Tempo Real")}
                    >
                        <div className="relative">
                            <SidebarItem
                                closeSidebar={closeSidebar}
                                icon={<FaComment />}
                                label="Chat"
                                link="/seller/chat"
                            />
                            {unreadMessagesCountContext > 0 && (
                                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] rounded-full bg-orange-500 flex items-center justify-center text-xs font-medium">
                                    {unreadMessagesCountContext > 99 ? "99+" : unreadMessagesCountContext}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <SidebarItem
                                closeSidebar={closeSidebar}
                                icon={<Bell />}
                                label="Notificações"
                                link="/seller/notifications"
                            />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] rounded-full bg-orange-500 flex items-center justify-center text-xs font-medium">
                                    {unreadNotifications.length > 99 ? "99+" : unreadNotifications.length}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <SidebarItem
                                closeSidebar={closeSidebar}
                                icon={<Scroll />}
                                label="Pedidos"
                                link="/seller/orders"
                            />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] rounded-full bg-orange-500 flex items-center justify-center text-xs font-medium">
                                    {unreadNotifications.length > 99 ? "99+" : unreadNotifications.length}
                                </span>
                            )}
                        </div>
                    </SidebarGroup>
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-700">
                    <SidebarGroup
                        title="Automarked"
                        expanded={expandedGroups["Automarked"]}
                        onToggle={() => toggleGroup("Automarked")}
                    >
                        <SidebarItem
                            closeSidebar={closeSidebar}
                            icon={<HelpCircle size={18} />}
                            label="Suporte"
                            link={`/seller/chat/${supportId}`}
                        />
                        <SidebarItem
                            closeSidebar={closeSidebar}
                            icon={<Globe size={18} />}
                            label="Políticas de Privacidade"
                            link="/legal/privacy-policy"
                        />
                        <SidebarItem
                            closeSidebar={closeSidebar}
                            icon={<Globe size={18} />}
                            label="Termos de Utilização"
                            link="/legal/terms-and-conditions"
                        />
                    </SidebarGroup>
                    <button
                        className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    link: string;
    closeSidebar: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, link, closeSidebar }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = link === "/seller"
        ? pathname === "/seller" || pathname === "/seller/"
        : pathname === link || pathname.startsWith(`${link}/`);

    return (
        <div
            onClick={() => {
                router.push(link);
                closeSidebar();
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                isActive 
                    ? "bg-slate-700 text-white font-medium" 
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
            }`}
        >
            <span className={`text-xl ${isActive ? "text-white" : "text-gray-400"}`}>{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
};

interface SidebarGroupProps {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
    title,
    children,
    expanded,
    onToggle,
}) => {
    return (
        <div className="mb-3">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full text-xs uppercase text-gray-400 hover:text-gray-300 px-2 py-2"
            >
                <span>{title}</span>
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
                <div className="space-y-1 pl-2 mt-1">{children}</div>
            </div>
        </div>
    );
};

export default Sidebar;
