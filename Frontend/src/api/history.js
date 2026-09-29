import axiosInstance from "./axios";

export const getWatchHistory = async () => {
    const response = await axiosInstance.get("/users/watch-history");

    return response.data.data;
};