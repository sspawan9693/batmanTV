import api from "./axios";

export const toggleVideoLike = async (videoId) => {
    const response = await api.post(`/likes/toggle/video/${videoId}`);
    return response.data.data;
};

export const getLikedVideos = async (page = 1, limit = 10) => {
    const response = await api.get(
        `/likes/videos?page=${page}&limit=${limit}`
    );

    return response.data.data;
};

export const toggleTweetLike = async (tweetId) => {
    const response = await api.post(
        `/likes/toggle/tweet/${tweetId}`
    );

    return response.data.data;
};