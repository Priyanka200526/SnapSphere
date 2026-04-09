import likeModel from "../model/like.model.js";

export const addLikeInfo = async (post, userId) => {
  const isLiked = await likeModel.findOne({ user: userId, post: post._id });
  const likesCount = await likeModel.countDocuments({ post: post._id });

  return {
    ...post,
    isLiked: Boolean(isLiked),
    likesCount,
  };
};