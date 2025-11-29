import api from './api';

export const getNotifications = async (userId) => {
  return api.get(`/notification/${userId}`);
};

export const markNotificationAsRead = async (id) => {
  return api.post(`/notification/mark-read`, { id });
};

export const markAsRead = (id) => api.post(`/notifications/mark-read/${id}`);

export const markAllAsRead = (userId) =>
  api.post(`/notifications/mark-all/${userId}`);
