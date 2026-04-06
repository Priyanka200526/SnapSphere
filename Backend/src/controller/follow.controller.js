import followModel from "../model/follow.model.js";
import authModel from "../model/auth.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const followUserController = asyncHandler(async (req, res) => {
    const follower = req.user.id;
    const followee = req.params.userid;

    if (follower === followee) {
        throw new AppError("You cannot follow yourself", 400);
    }

    const userExists = await authModel.findById(followee);
    if (!userExists) {
        throw new AppError("User does not exist", 404);
    }

    const alreadyRequested = await followModel.findOne({ follower, followee });
    if (alreadyRequested) {
        throw new AppError("Follow request already sent", 400);
    }

    const follow = await followModel.create({
        follower,
        followee,
        status: "pending"
    });

    res.status(201).json({
        success: true,
        message: "Follow request sent",
        data: follow
    });
});
export const acceptFollowRequest = asyncHandler(async (req, res) => {
    const followId = req.params.followid;

    const followRequest = await followModel.findById(followId);
    if (!followRequest) {
        throw new AppError("Follow request not found", 404);
    }

    if (followRequest.followee.toString() !== req.user.id) {
        throw new AppError("You are not allowed to accept this request", 403);
    }
    if (followRequest.status === "accepted") {
        throw new AppError("Already accepted", 400);
    }
    followRequest.status = "accepted";
    await followRequest.save();

    res.status(200).json({
        success: true,
        message: "Follow request accepted",
        data: followRequest
    });
});
export const rejectFollowRequest = asyncHandler(async (req, res) => {
    const followId = req.params.followid;

    const followRequest = await followModel.findById(followId);
    if (!followRequest) {
        throw new AppError("Follow request not found", 404);
    }

    if (followRequest.followee.toString() !== req.user.id) {
        throw new AppError("You are not allowed to reject this request", 403);
    }

    followRequest.status = "rejected";
    await followRequest.save();

    res.status(200).json({
        success: true,
        message: "Follow request rejected",
        data: followRequest
    });
});
export const getPendingRequests = asyncHandler(async (req, res) => {
    const userid = req.user.id;

    const requests = await followModel
        .find({ followee: userid, status: "pending" })
        .populate("follower", "username email");

    res.status(200).json({
        success: true,
        message: "Pending follow requests",
        data: requests
    });
});
export const unfollowUserController = asyncHandler(async (req, res) => {
    const follower = req.user.id;
    const followee = req.params.userid;

    const isFollowing = await followModel.findOne({ follower, followee });
    if (!isFollowing) {
        throw new AppError("You are not following this user", 400);
    }
    if (isFollowing.status !== "accepted") {
        throw new AppError("Follow request not accepted yet", 400);
    }
    await followModel.findOneAndDelete({ follower, followee });

    res.status(200).json({
        success: true,
        message: "User unfollowed successfully"
    });
});
export const getFollowStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const followers = await followModel.countDocuments({
        followee: userId,
        status: "accepted"
    });

    const following = await followModel.countDocuments({
        follower: userId,
        status: "accepted"
    });

    res.status(200).json({
        success: true,
        followers,
        following
    });
});

