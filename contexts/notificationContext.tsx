'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Notification } from '@/models/notification';
import { createdInstance } from '../hooks/useApi';
import io from 'socket.io-client';
import { apiBaseURL } from '@/constants/api';
import useSound from '../hooks/useSound';
import { toast } from '../hooks/use-toast';
import { useSocketContext } from './SocketContext';

interface NotificationContextData {
  notifications: Notification[];
  unreadNotifications: Notification[];
  unreadMessagesCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (newNotification: { title: string; message: string; type: string }) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData | null>(null);

export const NotificationProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const { socket } = useSocketContext()
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const { playSound } = useSound('notification');

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  useEffect(() => {
    if (socket) {
      socket.emit('joinNotificationRoom', { userId });

      socket.on('newNotification', (newNotification: Notification[]) => {
        playSound();
        newNotification[0].type
        showToast('Nova notificação!', '');
        setUnreadNotifications(prev => [newNotification[newNotification.length - 1], ...prev])
        setNotifications(() => newNotification);
      });

      socket.on('allNotificationsAsRead', () => setUnreadNotifications([]));
  
      socket.on('newMessage', async () => {
        playSound();
        showToast('Nova mensagem recebida!', '');
        setUnreadMessagesCount((prev) => prev + 1);
      });
    }
  }, [socket]);

  const getUnreadMessagesCount = useCallback(async () => {
    const response = await createdInstance.get<{ totalUnreadMessages: number }>(`/chat/unread/${userId}`);
    if (response.status === 200) setUnreadMessagesCount(response.data.totalUnreadMessages);
  }, [userId]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await createdInstance.get<Notification[]>(`/notifications/${userId}`);
      setNotifications(response.data.reverse());
    } catch {
      setError('Erro ao carregar notificações.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await createdInstance.get<Notification[]>(`/notifications/unread/${userId}`);
      setUnreadNotifications(response.data);
    } catch {
      setError('Erro ao carregar notificações não lidas.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addNotification = useCallback(async (newNotification: { title: string; message: string; type: string }) => {
    if (!socket || !userId) return;
    try {
      socket.emit('sendNotification', { ...newNotification, userId });
    } catch {
      setError('Erro ao adicionar notificação.');
    }
  }, [userId, socket]);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    try {
      await createdInstance.patch(`/notifications/read/${userId}`);
      fetchNotifications();
      setUnreadNotifications([]);
    } catch {
      setError('Erro ao marcar notificações como lidas.');
    }
  }, [userId, fetchNotifications]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!userId) return;
    try {
      await createdInstance.delete(`/notifications/${userId}/${notificationId}`);
      fetchNotifications();
    } catch {
      setError('Erro ao excluir notificação.');
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadNotifications();
    getUnreadMessagesCount();
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadNotifications,
        unreadMessagesCount,
        loading,
        error,
        addNotification,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationContext must be used within a NotificationProvider');
  return context;
};
