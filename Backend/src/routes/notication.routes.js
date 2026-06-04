import express from "express"
import identifyUser from "../middleware/auth.middleware.js";
import { getNotifications,getUnreadCount,markAllAsRead } from "../controller/notication.controller.js";
const notificationRoutes = express.Router()


notificationRoutes.get(
    "/",
    identifyUser,
    getNotifications
);
notificationRoutes.get("/unread-count",identifyUser,getUnreadCount)
notificationRoutes.patch("/read-all",identifyUser,markAllAsRead)


export default notificationRoutes