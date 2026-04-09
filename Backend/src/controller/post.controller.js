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
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const posts = await postModel.find({ user: userId }).lean();

  const updatedPosts = await addLikeInfoToPosts(posts, userId);

  res.status(200).json({
    status: true,
    posts: updatedPosts,
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
export const likePostController = asyncHandler(async (req, res, next) => {

  const userid = req.user.id
  const postid = req.params.postid

  const post = await postModel.findById(postid)

  if (!post) {
    return next(new AppError("Post not found", 404))
  }

  const alreadyLiked = await likeModel.findOne({
    user: userid,
    post: postid
  })

  if (alreadyLiked) {
    return next(new AppError("Post already liked", 400))
  }

  const likepost = await likeModel.create({
    post: postid,
    user: userid
  })

  res.status(201).json({
    status: true,
    message: "Post liked successfully",
    data: likepost
  })

})
export const unlikePost = asyncHandler(async (req, res, next) => {

  const userid = req.user.id
  const postid = req.params.postid

  const post = await postModel.findById(postid)

  if (!post) {
    return next(new AppError("Post not found", 404))
  }

  const isliked = await likeModel.findOne({
    user: userid,
    post: postid
  })

  if (!isliked) {
    return next(new AppError("Post not liked yet", 400))
  }

  await likeModel.deleteOne({
    user: userid,
    post: postid
  })

  res.status(200).json({
    status: true,
    message: "Post unliked successfully"
  })

})
export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const allPosts = await postModel.find({}).populate("user").lean();

  const posts = await addLikeInfoToPosts(allPosts, userId);

  res.status(200).json({
    status: true,
    data: posts,
  });
});
