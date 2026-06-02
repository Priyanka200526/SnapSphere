import asyncHandler from "../utils/asyncHandler.js";
import notificationModel from "../model/notification.model.js";
export const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await notificationModel
       .find({
        receiver: req.user.id
    })
    .populate("sender", "username profileImage")
    .populate("followId")
    .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        notifications
    });

});