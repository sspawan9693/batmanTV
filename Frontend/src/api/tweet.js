import api from "./axios";

// Get public tweet feed
export const getAllTweets = async (page = 1, limit = 10) => {
    const response = await api.get(
        `/tweets?page=${page}&limit=${limit}`
    );

    return response.data.data;
};


// Create a tweet
export const createTweet = async (content) => {
    const response = await api.post("/tweets", {
        content,
    });

    return response.data.data;
};


// Update a tweet
export const updateTweet = async (tweetId, content) => {
    const response = await api.patch(
        `/tweets/${tweetId}`,
        {
            content,
        }
    );

    return response.data.data;
};


// Delete a tweet
export const deleteTweet = async (tweetId) => {
    const response = await api.delete(
        `/tweets/${tweetId}`
    );

    return response.data.data;
};