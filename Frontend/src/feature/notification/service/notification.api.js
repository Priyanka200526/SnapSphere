import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})
export const getNotificationsApi = async () => {
    const { data } = await api.get("/notifications");
    return data;
};
export async function getUnreadCountApi() {
    const response = await api.get(
        "/notifications/unread-count",
        {
            withCredentials: true
        }
    );

    return response.data;
}
export async function markAllAsReadApi() {
    const response = await api.patch(
        "/notifications/read-all",
        {},
        {
            withCredentials: true
        }
    );

    return response.data;
}