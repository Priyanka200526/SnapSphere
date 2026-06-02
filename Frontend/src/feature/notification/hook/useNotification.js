import { useContext } from "react";
import { NotificationContext } from "../context/notification.context";
import { getNotificationsApi } from "../service/notification.api.js";

export const useNotification = () => {

    const {
        notifications,
        setNotifications
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

    return {

        notifications,
        handleGetNotifications

    };

};