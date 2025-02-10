'use client'

import NotificationsScreen from "@/components/both/notification";
import { ActionButtons } from "@/components/notification/notification-action-buttons";
import { NotificationCard } from "@/components/notification/notification-card";
import { NotificationHeader } from "@/components/notification/notification-header";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useUser } from "@/contexts/userContext";
import { formatRelativeDate } from "@/scripts/relative-date";
import { useEffect } from "react";

export default function Notifications() {
    const { notifications, markAllAsRead, deleteNotification } = useNotificationContext()
    
    useEffect(() => {
        (async () => {
            await markAllAsRead()
        })()
    }, [])

    const handleDeleteNotification = async (notificationId: string) => {
        await deleteNotification(notificationId)
    }

    return (
        <div className="space-y-4 px-4">
            <div>
                <NotificationHeader />
            </div>
            {notifications.map(nt => (
                <NotificationCard
                    key={nt._id}
                    avatar={nt.avatar}
                    name={nt.name}
                    action={nt.action}
                    detail={nt.detail}
                    time={formatRelativeDate(nt.time)}
                    unread={nt.unread}
                    onDelete={() => handleDeleteNotification(nt._id)}
                />
            ))}
        </div>
    )
}