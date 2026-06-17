import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import CommentModel from "../model/comments.model.js";
import PostModel from "../model/post.model.js";

export const addComment = asyncHandler(async (req, res, next) => {
    console.log("req.user =", req.user);
    const { text } = req.body;
    const { postId } = req.params;

    if (!text?.trim()) {
        return next(new AppError("Comment is required", 400));
    }

    const post = await PostModel.findById(postId);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    const comment = await CommentModel.create({
        text,
        user: req.user.id,
        post: postId
    });
    const populatedComment = await CommentModel
        .findById(comment._id)
        .populate("user", "username profileImage");

    res.status(201).json({
        success: true,
        comment: populatedComment
    });
});
export const getComments = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    const comments = await CommentModel.find({ post: postId })
        .populate("user", "username  profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        comments
    });
});
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
        return next(new AppError("Comment not found", 404));
    }

    if (comment.user.toString() !== req.user.id) {
        return next(new AppError("Unauthorized", 403));
    }

    await CommentModel.findByIdAndDelete(commentId);

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully"
    });
});
export const commentCount = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }
    const count = await CommentModel.countDocuments({ post: postId });

    res.status(200).json({
        success: true,
        count
    });
});
