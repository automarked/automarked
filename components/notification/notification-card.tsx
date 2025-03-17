import { clsx } from "clsx";
import { Bell, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  avatar: string;
  name: string;
  action: string;
  detail?: string;
  time: string;
  unread?: boolean;
  children?: React.ReactNode;
  onDelete?: () => void;
  notificationContent?: string; // Additional content to show in modal
  notificationId?: string; // ID for the notification
}

export function NotificationCard({
  avatar,
  name,
  action,
  detail,
  time,
  unread = false,
  children,
  onDelete,
  notificationContent = "",
  notificationId = ""
}: NotificationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening modal when clicking delete button
    if (!(e.target as HTMLElement).closest('button')) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex items-start space-x-3 py-3 px-3 hover:bg-gray-100 border-b relative group cursor-pointer",
          unread && "bg-gray-50"
        )}
        onClick={handleCardClick}
      >
        {avatar ? (
          <Image
            width={100}
            height={100}
            src={avatar}
            alt={`${name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <Avatar>
            <AvatarFallback>
              {name.split(" ")[0][0]}
              {name.split(" ")[1]?.[0] || ""}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <div className="text-sm">
            <span className="font-semibold">{name}</span>{" "}
            <span>{action}</span>{" "}
            {detail && (
              <span className="font-semibold text-blue-600">{detail}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>
        {children && children}
        {unread && <Bell className="w-5 h-5 text-blue-500" />}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Detalhes da Notificação
            </DialogTitle>
            <DialogDescription>
              {unread && <span className="text-blue-500 font-medium">Nova notificação</span>}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-start space-x-3 py-4">
            {avatar ? (
              <Image
                width={100}
                height={100}
                src={avatar}
                alt={`${name}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-lg">
                  {name.split(" ")[0][0]}
                  {name.split(" ")[1]?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <div className="text-base mb-1">
                <span className="font-semibold">{name}</span>{" "}
                <span>{action}</span>{" "}
                {detail && (
                  <span className="font-semibold text-blue-600">{detail}</span>
                )}
              </div>
              <div className="text-sm text-gray-500 mb-3">{time}</div>
              
              {notificationContent && (
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {notificationContent}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between gap-1">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
                setIsModalOpen(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}