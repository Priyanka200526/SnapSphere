import express from "express"
import identifyUser from "../middleware/auth.middleware.js";
import { getNotifications } from "../controller/notication.controller.js";
const notificationRoutes = express.Router()


notificationRoutes.get(
    "/",
    identifyUser,
    getNotifications
);

export default notificationRoutes