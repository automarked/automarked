import { createdInstance } from "@/hooks/useApi";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface NotificationContextProps {
  notifications: string[]; // Vetor de IDs de notificações
  fetchNotifications: (companyId: string) => Promise<void>;
  addNotification: (companyId: string, notificationId: string) => Promise<void>;
  removeNotification: (companyId: string, notificationId: string) => Promise<void>;
  clearNotifications: (companyId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const NotificationGroupContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationGroupProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createdInstance.get(`/notifications-group/${companyId}`);
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao buscar notificações");
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = useCallback(
    async (companyId: string, notificationId: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await createdInstance.post(`/notifications-group/add`, { companyId, notificationId });
        setNotifications(data.notifications);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao adicionar notificação");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeNotification = useCallback(
    async (companyId: string, notificationId: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await createdInstance.post(`/notifications-group/remove`, { companyId, notificationId });
        setNotifications(data.notifications);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao remover notificação");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearNotifications = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      await createdInstance.post(`/notifications-group/delete`, { companyId });
      setNotifications([]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao limpar notificações");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <NotificationGroupContext.Provider
      value={{
        notifications,
        fetchNotifications,
        addNotification,
        removeNotification,
        clearNotifications,
        loading,
        error,
      }}
    >
      {children}
    </NotificationGroupContext.Provider>
  );
};

export const useNotificationGroupContext: () => NotificationContextProps = (): NotificationContextProps => {
  const context = useContext(NotificationGroupContext);
  if (!context) {
    throw new Error(
      "useNotificationContext deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};
