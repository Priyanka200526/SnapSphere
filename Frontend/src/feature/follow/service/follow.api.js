import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})
export const followUserApi = async (userId) => {
    const { data } = await api.post(`/follow/follow/${userId}`);
    return data;
};

export const unfollowUserApi = async (userId) => {
    const { data } = await api.post(`/follow/unfollow/${userId}`);
    return data;
};

export const getFollowStatsApi = async () => {
    const { data } = await api.get(`/follow/stats`);
    return data;
};