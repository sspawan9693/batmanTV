import axiosInstance from "./axios";

// =========================
// Get User Playlists
// =========================

export const getUserPlaylists = async (
    userId,
    page = 1,
    limit = 12
) => {

    const response = await axiosInstance.get(
        `/playlists/user/${userId}`,
        {
            params: {
                page,
                limit,
            },
        }
    );

    return response.data.data;
};

// =========================
// Get Playlist By Id
// =========================

export const getPlaylistById = async (playlistId) => {

    const response = await axiosInstance.get(
        `/playlists/${playlistId}`
    );

    return response.data.data;
};

// =========================
// Create Playlist
// =========================

export const createPlaylist = async (data) => {

    const response = await axiosInstance.post(
        "/playlists",
        data
    );

    return response.data.data;
};

// =========================
// Update Playlist
// =========================

export const updatePlaylist = async (
    playlistId,
    data
) => {

    const response = await axiosInstance.patch(
        `/playlists/${playlistId}`,
        data
    );

    return response.data.data;
};

// =========================
// Delete Playlist
// =========================

export const deletePlaylist = async (playlistId) => {

    const response = await axiosInstance.delete(
        `/playlists/${playlistId}`
    );

    return response.data.data;
};

// =========================
// Add Video
// =========================

export const addVideosToPlaylist = async (
    playlistId,
    videoId
) => {

    const response = await axiosInstance.post(
        `/playlists/${playlistId}/videos/${videoId}`
    );

    return response.data.data;
};

// =========================
// Remove Video
// =========================

export const removeVideosFromPlaylist = async (
    playlistId,
    videoId
) => {

    const response = await axiosInstance.delete(
        `/playlists/${playlistId}/videos/${videoId}`
    );

    return response.data.data;
};