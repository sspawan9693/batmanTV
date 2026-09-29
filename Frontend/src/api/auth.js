import axios from "./axios";

export const loginUser = async (credentials) => {
  const { data } = await axios.post("/users/login", credentials);
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await axios.get("/users/current-user");
  return data.data;
};

export const logoutUser = async () => {
  const { data } = await axios.post("/users/logout");
  return data;
};

export const registerUser = async (formData) => {
    const { data } = await axios.post(
        "/users/register",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data.data;
};