// app/notifications/page.tsx
import { FC } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeDate } from "@/scripts/relative-date";
import Image from "next/image";

type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  type: string;
};

type Props = {
  notifications: Notification[];
};

// Componente para renderizar cada notificação
const NotificationItem: FC<{ item: Notification }> = ({ item }) => {
  return (
    <Card className="flex flex-row items-center border-2 gap-4 p-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex justify-center">
        {/* Substitua a imagem pelo ícone correto */}
        <img src="/images/offer.png" alt="Notification Icon" className="w-12 h-12" />
      </div>
      <div className="flex-1 h-[150px]">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.message}</CardDescription>
        </CardHeader>
        <p className="text-sm text-end text-muted-foreground mt-2">
          {formatRelativeDate(item.createdAt)}
        </p>
        {/* Botão opcional para tipos específicos */}
       {/*  {item.type.toLowerCase() === "wishlist" && (
          <Button variant="outline" className="mt-2">
            Ver perfil
          </Button>
        )} */}
      </div>
    </Card>
  );
};

const NotificationsScreen: FC<Props> = ({ notifications }) => {
  return (
    <ScrollArea className="p-4 space-y-4">
      {notifications.length > 0 && notifications.map((notification) => (
        <NotificationItem key={notification._id} item={notification} />
      ))}
      {notifications.length===0 && (
        <div className="w-full flex flex-col gap-4 items-center">
          <small className="text-gray-400">Você não possuí nenhuma notificação ainda!</small>
          <Image
            src="/images/notification-icon.png"
            alt="no notification found!"
            width={300}
            height={300}
          />
        </div>
      )}
    </ScrollArea>
  );
};

export default NotificationsScreen;
