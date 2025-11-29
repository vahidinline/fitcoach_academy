import { createContext, useContext, useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../api/notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await getNotifications(userId);
      const list = res.data.notifications || [];

      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  };

  const readNotification = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        readNotification,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
