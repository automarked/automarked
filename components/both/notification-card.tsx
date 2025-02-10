import { clsx } from "clsx";
import { Bell } from "lucide-react";

interface NotificationCardProps {
  avatar: string;
  name: string;
  action: string;
  detail?: string;
  time: string;
  unread?: boolean;
  children?: React.ReactNode
}

export function NotificationCard({
  avatar,
  name,
  action,
  detail,
  time,
  unread = false,
  children
}: NotificationCardProps) {
  return (
    <div
      className={clsx(
        "flex items-start space-x-3 py-2 px-3 hover:bg-gray-100 border-b ",
        unread && "bg-gray-50"
      )}
    >
      <img
        src={avatar}
        alt={`${name}'s avatar`}
        className="w-10 h-10 rounded-full"
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
    </div>
  );
}
