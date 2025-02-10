"use client";

import { apiBaseURL } from "@/constants/api";
import { IUser } from "@/models/user";
import { usePathname, useRouter } from "next/navigation"; // Hook para verificar o caminho atual
import { Home, Settings, Users, BarChart2, Globe, Bell, Megaphone, ShoppingCart, Heart, Store } from "lucide-react";
import Link from "next/link";
import { FaCar, FaComment } from "react-icons/fa";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useUser } from "@/contexts/userContext";
import { useChatContext } from "@/contexts/chatContext";
import { useEffect } from "react";
import Image from "next/image";

const Sidebar: React.FC<{ currentProfile: IUser; isOpen: boolean, closeSidebar: () => void }> = ({ currentProfile, isOpen, closeSidebar }) => {
    const { unreadNotifications, unreadMessagesCount } = useNotificationContext();
    const { getUnreadMessagesCount, unreadMessagesCount: unreadMessagesCountContext } = useChatContext()
    const { profile, imageURL } = useUser(currentProfile.userId)

    useEffect(() => {
        getUnreadMessagesCount();
    }, [unreadMessagesCount])

    const router = useRouter()
    return (
        <div
            data-open={isOpen}
            className={`fixed top-0 z-[999] left-0 h-screen w-64 bg-[#1e293b] text-white transform transition-transform duration-300 ease-in-out data-[open=true]:translate-x-0 data-[open=false]:-translate-x-full md:translate-x-0 md:static`}
        >
            {/* Perfil do Usuário */}
            <div className="flex flex-col items-center py-6 border-b border-gray-700">
                <Image
                    onClick={() => router.push('/seller/profile')}
                    src={imageURL}
                    width={150}
                    height={150}
                    alt="User"
                    className="w-20 cursor-pointer h-20 object-cover rounded-full border-2 border-white"
                />
                <h2 className="mt-3 font-semibold text-lg">{profile?.firstName} {profile?.lastName}</h2>
                <p className="text-sm text-gray-400">{profile?.email}</p>
            </div>

            {/* Menu Principal */}
            <nav className="flex-1 mt-4 px-4 space-y-2">
                <SidebarItem closeSidebar={closeSidebar} icon={<BarChart2 />} label="Início" link="/seller" />
                <SidebarItem closeSidebar={closeSidebar} icon={<ShoppingCart />} label="Carrinho" link="/seller/shopping-cart" />
                <SidebarItem closeSidebar={closeSidebar} icon={<Heart />} label="Meus Favoritos" link="/seller/favorites" />
                <SidebarItem closeSidebar={closeSidebar} icon={<Store />} label="Concessionárias" link="/seller/stores" />
                <SidebarGroup title="Tempo Real">
                    <div className="relative">
                        <SidebarItem closeSidebar={closeSidebar} icon={<FaComment />} label="Chat" link="/seller/chat" />
                        {unreadMessagesCountContext > 0 && (
                            <div className="absolute top-1 left-20 w-4 h-4 rounded-full bg-[var(--orange-dark)] flex items-center justify-center">
                                <span className="text-xs text-white">{unreadMessagesCountContext}</span>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <SidebarItem closeSidebar={closeSidebar} icon={<Bell />} label="Notificações" link="/seller/notifications" />
                        {unreadNotifications.length > 0 && (
                            <div className="absolute top-1 left-32 w-4 h-4 rounded-full bg-[var(--orange-dark)] flex items-center justify-center">
                                <span className="text-xs text-white">{unreadNotifications.length}</span>
                            </div>
                        )}
                    </div>
                </SidebarGroup>
                {/*  <SidebarGroup title="Auto Market">
                    <SidebarItem closeSidebar={closeSidebar} icon={<Megaphone />} label="Anúncios" link="/seller/ads" />
                    <SidebarItem closeSidebar={closeSidebar} icon={<Settings />} label="Configurações" link="/seller/account-settings" />
                </SidebarGroup> */}
            </nav>
        </div>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    link: string;
    closeSidebar: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, link, closeSidebar }) => {
    const router = useRouter()
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div
            onClick={() => {
                router.push(link)

            }}
            className={`flex items-center gap-4 px-3 py-2 rounded cursor-pointer transition-colors ${isActive ? "font-bold text-orange-500" : "hover:bg-gray-700"
                }`}
        >
            <div className="text-xl">{icon}</div>
            <span className="text-sm">{label}</span>
        </div>
    );
};

interface SidebarGroupProps {
    title: string;
    children: React.ReactNode;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children }) => {
    return (
        <div>
            <h3 className="text-xs uppercase text-gray-400 mt-4 mb-2">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
};

export default Sidebar;
