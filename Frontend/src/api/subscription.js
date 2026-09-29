import api from "./axios";

export const toggleSubscription = async (channelId) => {
  const response = await api.post(`/subscriptions/c/${channelId}`);
  return response.data.data;
};

export const getChannelSubscribers = async (channelId) => {
  const response = await api.get(`/subscriptions/c/${channelId}`);
  return response.data.data.docs;
};