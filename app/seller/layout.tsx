'use client';

import AppSellerHeader from "@/components/ui/seller/header";
import Sidebar from "@/components/ui/seller/sidebar";
import { useUser } from "@/contexts/userContext";
import { usePathname } from "next/navigation";
import { NotificationProvider } from "@/contexts/notificationContext";
import { useAuth } from "@/contexts/AuthContext";
import WhatsAppFloatingButton from "@/components/both/contact-support";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { secureGet } from "@/secure/sessions";
import { ChatProvider } from "@/contexts/chatContext";
import { getCookie } from "@/secure/cookies";
import { InventoryProvider } from "@/contexts/InventoryContext";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const { user: us } = useAuth();
    const { user, profile } = useUser(us?.uid ?? '');
    const { isOpen, toggleSidebar, closeSidebar } = useMaterialLayout()

    const pathname = usePathname();

    useEffect(() => {
        closeSidebar();
        const token = getCookie("access");
        if (!token) window.location.href = '/login-with-credentials'
    }, [pathname])

    const hideHeaderRoutes = ["/seller/chat", "/seller/chat/:id"];
    const shouldHideHeader = hideHeaderRoutes.some(route => {
        const isDynamic = route.includes(":id");
        return isDynamic
            ? pathname.startsWith("/seller/chat/")
            : pathname === route;
    });
    console.log(profile)
    if (user && profile)
        return (
            <>
                <NotificationProvider userId={us?.uid ?? ''}>
                    <InventoryProvider userId={profile?.userId ?? ''}>
                        <ChatProvider senderId={profile?.userId ?? ''}>
                            <div className="flex-1 h-screen p-0 flex relative">
                                <Sidebar closeSidebar={closeSidebar} currentProfile={profile} isOpen={isOpen} />

                                <div
                                    data-open={isOpen}
                                    className={`flex-1 h-screen md:h-full p-0  relative md:bg-gray-100 transition-all duration-300 data-[open=true]:ml-0 md:data-[open=false]:-ml-64 md:ml-64 overflow-y-auto md:min-h-full md:h-screen`}
                                >
                                    {!shouldHideHeader && (
                                        <AppSellerHeader toggleSidebar={toggleSidebar} user={user} />
                                    )}
                                    <main className="w-full h-screen md:min-h-full md:h-full overflow-y-scroll max-w-[1500px] mt-0 bg-white mx-auto">{children}</main>
                                </div>
                            </div>
                        </ChatProvider>
                    </InventoryProvider>
                </NotificationProvider>
            </>
        );
}
