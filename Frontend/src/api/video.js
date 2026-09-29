import api from "./axios";


// ================= VIDEO =================

export const getVideoById = async (videoId) => {
    const response = await api.get(
        `/videos/${videoId}`
    );

    return response.data.data;
};


export const getAllVideos = async () => {
    const response = await api.get(
        "/videos?limit=12"
    );

    return response.data.data.docs;
};


export const uploadVideo = async (
    formData,
    onUploadProgress
) => {
    const { data } = await api.post(
        "/videos/upload",
        formData,
        {
            onUploadProgress,
        }
    );

    return data.data;
};


// ================= DASHBOARD =================

export const getChannelStats = async () => {
    const response = await api.get(
        "/dashboard/stats"
    );

    return response.data.data;
};


export const getChannelVideos = async (
    page = 1,
    limit = 10
) => {
    const response = await api.get(
        `/dashboard/videos?page=${page}&limit=${limit}`
    );

    return response.data.data;
};


// ================= VIDEO MANAGEMENT =================

export const updateVideo = async (
    videoId,
    formData
) => {
    const response = await api.patch(
        `/videos/${videoId}`,
        formData
    );

    return response.data.data;
};


export const deleteVideo = async (
    videoId
) => {
    const response = await api.delete(
        `/videos/${videoId}`
    );

    return response.data.data;
};


export const togglePublishStatus = async (
    videoId
) => {
    const response = await api.patch(
        `/videos/${videoId}/toggle-publish`
    );

    return response.data.data;
};