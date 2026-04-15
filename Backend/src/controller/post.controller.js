import postModel from "../model/post.model.js";
import likeModel from "../model/like.model.js";
import Imagekit, { toFile } from "@imagekit/nodejs";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { addLikeInfoToPosts } from "../utils/addLikeInfoToPosts.js";

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

export const createPost = asyncHandler(async (req, res, next) => {

  if (!req.files || req.files.length === 0) {
    return next(new AppError("At least one image is required", 400));
  }

  const imageUrls = [];

  for (const file of req.files) {
    const uploaded = await imagekit.files.upload({
      file: await toFile(Buffer.from(file.buffer), "file"),
      fileName: `post_${Date.now()}.jpg`,
      folder: "user_image",
    });

    imageUrls.push(uploaded.url);
  }

  const post = await postModel.create({
    caption: req.body.caption,
    images: imageUrls,
    user: req.user.id
  });

  res.status(201).json({
    status: true,
    message: "Post created successfully",
    data: post
  });
});
export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  console.log("params:", req.params);

  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.user.toString() !== req.user.id) {
    return next(new AppError("You are not allowed to delete this post", 403));
  }
  for (const imageUrl of post.images) {
    try {
      const fileId = imageUrl.split("/").pop().split(".")[0];
      await imagekit.files.deleteFile(fileId);
    } catch (err) {
      console.log("Image delete failed:", err.message);
    }
  }

  await post.deleteOne();

  res.status(200).json({
    status: true,
    message: "Post deleted successfully"
  });
});
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const posts = await postModel.find({ user: userId }).lean();

  const updatedPosts = await addLikeInfoToPosts(posts, userId);

  const postsCount = posts.length; 

  res.status(200).json({
    status: true,
    posts: updatedPosts,
    postsCount, 
  });
});
export const getPostDetailsController = asyncHandler(async (req, res, next) => {

  const userid = req.user.id;
  const postid = req.params.postid;

  const postdetails = await postModel
    .findById(postid)
    .populate("user", "username profileImage");

  if (!postdetails) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    status: true,
    message: "post details feched successfully",
    data: postdetails
  });

});
export const toggleLikePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.postid;

  const post = await postModel.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const existingLike = await likeModel.findOne({
    user: userId,
    post: postId,
  });

  if (existingLike) {

    await likeModel.deleteOne({ _id: existingLike._id });

    return res.status(200).json({
      status: true,
      message: "Post unliked",
      liked: false,
    });
  } else {

    const newLike = await likeModel.create({
      user: userId,
      post: postId,
    });

    return res.status(201).json({
      status: true,
      message: "Post liked",
      liked: true,
      data: newLike,
    });
  }
});
export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const allPosts = await postModel.find({}).populate("user").lean();

  const posts = await addLikeInfoToPosts(allPosts, userId);

  res.status(200).json({
    status: true,
    data: posts,
  });
});
