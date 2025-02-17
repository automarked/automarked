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

    if (user && profile)
        return (
            <>
                <NotificationProvider userId={us?.uid ?? ''}>
                    <ChatProvider senderId={us?.uid ?? ''}>
                        <div className="flex-1 h-screen p-0 flex relative">
                            <Sidebar closeSidebar={closeSidebar} currentProfile={profile} isOpen={isOpen} />

                            <div
                                data-open={isOpen}
                                className={`flex-1 bg-gray-50 transition-all duration-300 data-[open=true]:ml-0 md:data-[open=false]:-ml-64 md:ml-64`}
                            >
                                {!shouldHideHeader && (
                                    <AppSellerHeader toggleSidebar={toggleSidebar} user={user} />
                                )}
                                <main className="w-full h-screen">{children}</main>
                            </div>
                        </div>
                    </ChatProvider>
                </NotificationProvider>
                <WhatsAppFloatingButton />
            </>
        );
}
