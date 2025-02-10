import { Check, Settings, Trash2 } from "lucide-react";
import { useNotificationContext } from "@/contexts/notificationContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import Loader from "../loader";

export function NotificationHeader() {
  const { notifications, deleteNotification } = useNotificationContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteAll = () => {
    setIsLoading(true)
    notifications.forEach(notification => {
      deleteNotification(notification._id);
      console.log(notifications)
    });

    if (notifications.length === 0) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pb-2 border-b">
      <h2 className="text-lg font-semibold">Notificações</h2>
      <div className="flex items-center space-x-2">
        {/* <button>
          <Check className="w-5 h-5" />
        </button> */}

        {/* <AlertDialog>
          <AlertDialogTrigger asChild>
            <button>
              <Trash2 className="w-5 h-5 hover:text-red-600" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar todas as notificações</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar todas as notificações? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAll}> Deletar todas</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}

        {/* <button>
          <Settings className="w-5 h-5" />
        </button> */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-40">
            <div className="bg-white rounded text-black">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}