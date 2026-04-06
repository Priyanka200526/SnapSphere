import postModel from "../model/post.model.js";
import likeModel from "../model/like.model.js";
import Imagekit, { toFile } from "@imagekit/nodejs";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

export const createpostcontroller = asyncHandler(async (req, res, next) => {

  // ✅ 1. files check
  if (!req.files || req.files.length === 0) {
    return next(new AppError("At least one image is required", 400));
  }

  // ✅ 2. upload all images
  const imageUrls = [];

  for (const file of req.files) {
    const uploaded = await imagekit.files.upload({
      file: await toFile(Buffer.from(file.buffer), "file"),
      fileName: `post_${Date.now()}.jpg`,
      folder: "user_image",
    });

    imageUrls.push(uploaded.url);
  }

  // ✅ 3. create post
  const post = await postModel.create({
    caption: req.body.caption,
    images: imageUrls,   // 🔥 change here
    user: req.user.id
  });

  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    post
  });
});
export const getPostController = asyncHandler(async (req, res, next) => {

  const posts = await postModel.find({
    user: req.user.id
  })

  res.status(200).json({
    status: "success",
    results: posts.length,
    posts
  })
})
export const getPostDetailsController = asyncHandler(async (req, res, next) => {

  const userid = req.user.id;
  const postid = req.params.postid;

  const postdetails = await postModel
    .findById(postid)
    .populate("user", "username profileImage");

  if (!postdetails) {
    return next(new AppError("Post not found", 404));
  }

  const isvalidateuser = postdetails.user._id.toString() === userid;

  if (!isvalidateuser) {
    return next(new AppError("Forbidden Content", 403));
  }

  res.status(200).json({
    status: "success",
    postdetails
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
    status: "success",
    message: "Post liked successfully",
    likepost
  })

})
export const UnlikePostController = asyncHandler(async (req, res, next) => {

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
    status: "success",
    message: "Post unliked successfully"
  })

})
export const getFeedController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const allPosts = await postModel.find({}).populate("user").lean();

  const posts = await Promise.all(
    allPosts.map(async (post) => {
      const isLiked = await likeModel.findOne({ user: userId, post: post._id });
      const likesCount = await likeModel.countDocuments({ post: post._id });

      return {
        ...post,
        isLiked: Boolean(isLiked),
        likesCount
      };
    })
  );

  res.status(200).json({
    message: "Posts fetched successfully.",
    posts
  });
});
