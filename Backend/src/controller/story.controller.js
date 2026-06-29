// controller/story.controller.js
import Imagekit, { toFile } from "@imagekit/nodejs";
import storyModel from "../model/story.model.js";
import storyViewModel from "../model/storyView.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadStory = asyncHandler(async (req, res, next) => {

  if (!req.file) {
    return next(new AppError("Media file is required", 400));
  }

  const isVideo = req.file.mimetype.startsWith("video");

  const uploaded = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: `story_${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
    folder: "user_story",
  });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const story = await storyModel.create({
    userId: req.user.id,
    mediaUrl: uploaded.url,
    mediaType: isVideo ? "video" : "image",
    createdAt: now,
    expiresAt
  });

  res.status(201).json({
    status: true,
    message: "Story uploaded successfully",
    story
  });

});

export const getStories = asyncHandler(async (req, res, next) => {

  const now = new Date();

  const stories = await storyModel.find({ expiresAt: { $gt: now } })
    .populate("userId", "username profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: true,
    stories
  });

});

export const viewStory = asyncHandler(async (req, res, next) => {

  const { storyId } = req.params;
  const viewerId = req.user.id;

  const story = await storyModel.findById(storyId);

  if (!story) {
    return next(new AppError("Story not found or expired", 404));
  }

  await storyViewModel.findOneAndUpdate(
    { storyId, viewerId },
    { $setOnInsert: { viewedAt: new Date() } },
    { upsert: true }
  );

  res.status(200).json({
    status: true,
    message: "Story viewed"
  });

});

export const getStoryViewers = asyncHandler(async (req, res, next) => {

  const { storyId } = req.params;

  const views = await storyViewModel.find({ storyId })
    .populate("viewerId", "username profilePic")
    .sort({ viewedAt: -1 });

  res.status(200).json({
    status: true,
    count: views.length,
    views
  });

});