import { clsx } from "clsx";
import { Bell, Trash2 } from "lucide-react";
import Image from "next/image";

interface NotificationCardProps {
  avatar: string;
  name: string;
  action: string;
  detail?: string;
  time: string;
  unread?: boolean;
  children?: React.ReactNode;
  onDelete?: () => void;
}

export function NotificationCard({
  avatar,
  name,
  action,
  detail,
  time,
  unread = false,
  children,
  onDelete
}: NotificationCardProps) {
  return (
    <div
      className={clsx(
        "flex items-start space-x-3 py-2 px-3 hover:bg-gray-100 border-b relative group",
        unread && "bg-gray-50"
      )}
    >
      <Image
        width={100}
        height={100}
        src={avatar}
        alt={`${name}'s avatar`}
        className="w-10 h-10 rounded-full object-cover"
      />
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
        onClick={onDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
      </button>
    </div>
  );
}