'use client'

import { useNotificationContext } from "@/contexts/notificationContext";
import { formatRelativeDate } from "@/scripts/relative-date";
import { useEffect, useState } from "react";
import { NotificationHeader } from "@/components/notification/notification-header";
import { NotificationCard } from "@/components/notification/notification-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellOff, Inbox } from "lucide-react";
import { motion } from "framer-motion";

export default function Notifications() {
  const { notifications, markAllAsRead, deleteNotification } =
    useNotificationContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const markAsRead = async () => {
      setIsLoading(true);
      try {
        await markAllAsRead();
      } finally {
        setIsLoading(false);
      }
    };
    markAsRead();
  }, [markAllAsRead]);

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const unreadNotifications = notifications.filter((n) => n.unread);
  const readNotifications = notifications.filter((n) => !n.unread);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <NotificationHeader />
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Inbox className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-500 max-w-md">
                Você não tem notificações no momento. Quando receber, elas
                aparecerão aqui.
              </p>
            </motion.div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4" />
                  <span>Todas</span>
                  <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="flex items-center gap-1.5"
                >
                  <Bell className="h-4 w-4" />
                  <span>Não lidas</span>
                  {unreadNotifications.length > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                      {unreadNotifications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read" className="flex items-center gap-1.5">
                  <BellOff className="h-4 w-4" />
                  <span>Lidas</span>
                  {readNotifications.length > 0 && (
                    <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                      {readNotifications.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="rounded-lg border overflow-hidden divide-y"
                >
                  {notifications.map((nt) => (
                    <NotificationCard
                      key={nt._id}
                      avatar={nt.avatar}
                      name={nt.name}
                      action={nt.action}
                      detail={nt.detail}
                      time={formatRelativeDate(nt.time)}
                      unread={nt.unread}
                      onDelete={() => handleDeleteNotification(nt._id)}
                      notificationId={nt._id}
                    />
                  ))}
                </motion.div>
              </TabsContent>
              <TabsContent value="unread">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg border">
                    <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Não há notificações não lidas
                    </p>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="rounded-lg border overflow-hidden divide-y"
                  >
                    {unreadNotifications.map((nt) => (
                      <NotificationCard
                        key={nt._id}
                        avatar={nt.avatar}
                        name={nt.name}
                        action={nt.action}
                        detail={nt.detail}
                        time={formatRelativeDate(nt.time)}
                        unread={nt.unread}
                        onDelete={() => handleDeleteNotification(nt._id)}
                        notificationId={nt._id}
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>
              <TabsContent value="read">
                {readNotifications.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg border">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Não há notificações lidas</p>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="rounded-lg border overflow-hidden divide-y"
                  >
                    {readNotifications.map((nt) => (
                      <NotificationCard
                        key={nt._id}
                        avatar={nt.avatar}
                        name={nt.name}
                        action={nt.action}
                        detail={nt.detail}
                        time={formatRelativeDate(nt.time)}
                        unread={nt.unread}
                        onDelete={() => handleDeleteNotification(nt._id)}
                        notificationId={nt._id}
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
