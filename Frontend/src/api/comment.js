import api from "./axios";

export const getVideoComments = async (videoId) => {
  const response = await api.get(`/comments/video/${videoId}`);
  return response.data.data.docs;
};

export const addComment = async (videoId, content) => {
  const response = await api.post(`/comments/video/${videoId}`, {
    content,
  });

  return response.data.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/${commentId}`, {
    content,
  });

  return response.data.data;
};

export const deleteComment = async (commentId) => {
  await api.delete(`/comments/${commentId}`);
};