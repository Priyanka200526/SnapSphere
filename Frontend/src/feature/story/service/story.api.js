import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/story",
    withCredentials: true
});
export const uploadStoryApi = async (file, textItems = []) => {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("textItems", JSON.stringify(textItems));
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
    const { data } = await api.post("/upload", formData);
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