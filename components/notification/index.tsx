import { ActionButtons } from "./notification-action-buttons";
import { NotificationCard } from "./notification-card";
import { NotificationHeader } from "./notification-header";

export default function NotificationsComponent() {
  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <NotificationHeader />
      <div className="mt-4 space-y-4">
        <NotificationCard
          avatar="https://via.placeholder.com/150"
          name="Amélie"
          action="commented in"
          detail="Dashboard 2.0"
          time="2 hours ago"
          unread
        />
        <NotificationCard
          avatar="https://via.placeholder.com/150"
          name="Sienna"
          action="followed you"
          time="2 hours ago"
          unread
        />
        <NotificationCard
          avatar="https://via.placeholder.com/150"
          name="Ammar"
          action="invited you to"
          detail="Blog design"
          time="3 hours ago"
        >
          <ActionButtons
            onAccept={() => alert("Accepted")}
            onDecline={() => alert("Declined")}
          />
        </NotificationCard>
      </div>
    </div>
  );
}
