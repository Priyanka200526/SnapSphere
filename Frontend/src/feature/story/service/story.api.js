// service/story.api.js
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/story",
    withCredentials: true
});

export const uploadStoryApi = async (file) => {
    const formData = new FormData();
    formData.append("media", file);

    const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const getStoriesFeedApi = async () => {
    const { data } = await api.get("/feed");
    return data;
};

export const viewStoryApi = async (storyId) => {
    const { data } = await api.post(`/${storyId}/view`, {});
    return data;
};

export const getStoryViewersApi = async (storyId) => {
    const { data } = await api.get(`/${storyId}/viewers`);
    return data;
};