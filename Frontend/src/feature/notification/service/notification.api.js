import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})
export const getNotificationsApi = async () => {
    const { data } = await api.get("/notifications");
    return data;
};