import api from './api';

export const getActiveSubscription = (userId) =>
  api.get(`/api/subscription/active/${userId}`);

export const getSubscriptionHistory = (userId) =>
  api.get(`/api/subscription/history/${userId}`);

export const buySubscription = (payload) =>
  api.post(`/api/subscription/buy`, payload);
