import axiosInstance from "./axios";

export const updateAccount = async (data) => {
    const response = await axiosInstance.patch(
        "/users/update-account",
        data
    );

    return response.data.data;
};

export const updateAvatar = async (avatar) => {
    const formData = new FormData();

    formData.append("avatar", avatar);

    const response = await axiosInstance.patch(
        "/users/change-avatar",
        formData
    );

    return response.data.data;
};

export const updateCoverImage = async (coverImage) => {
    const formData = new FormData();

    formData.append("coverImage", coverImage);

    const response = await axiosInstance.patch(
        "/users/change-cover-image",
        formData
    );

    return response.data.data;
};

export const changePassword = async (passwords) => {
    const response = await axiosInstance.post(
        "/users/change-password",
        passwords
    );

    return response.data.data;
};