import { addLikeInfo } from "./addLikeInfo.js";

export const addLikeInfoToPosts = async (posts, userId) => {
  return await Promise.all(
    posts.map((post) => addLikeInfo(post, userId))
  );
};