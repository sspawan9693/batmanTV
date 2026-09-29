import api from "./axios";

export const getChannel = async (username) => {
    const { data } = await api.get(
        `/users/channel/${username}`
    );

    return data.data;
};

