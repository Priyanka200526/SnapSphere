import { useContext } from "react";
import { NotificationContext } from "../context/notification.context";
import { getNotificationsApi, getUnreadCountApi, markAllAsReadApi } from "../service/notification.api.js";

export const useNotification = () => {

    const {
        notifications,
        setNotifications,unreadCount,setUnreadCount
    } = useContext(NotificationContext);

    async function handleGetNotifications() {
        try {

            const data = await getNotificationsApi();

            setNotifications(data.data);

            return data.data;

        } catch (err) {
            console.log(err);
        }
    }
    async function handleGetUnreadCount() {

        try {

            const data = await getUnreadCountApi();

            setUnreadCount(data.count);

        } catch (err) {

            console.log(err);

        }

    }
    async function handleMarkAllAsRead() {

        try {

            await markAllAsReadApi();

            setUnreadCount(0);

        } catch (err) {

            console.log(err);

        }

    }

    return {
        notifications,
        handleGetNotifications,
        unreadCount,
        setUnreadCount,
        handleGetUnreadCount,
        handleMarkAllAsRead
    };

};