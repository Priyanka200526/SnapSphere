export const getAllPostsService = async () => {
  return await postModel.find({}).populate("user").lean();
};

export const getUserPostsService = async (userId) => {
  return await postModel.find({ user: userId }).lean();
};