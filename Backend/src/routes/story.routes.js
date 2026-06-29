import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import multer from "multer";
import {
  uploadStory,
  getStories,
  viewStory,
  getStoryViewers
} from "../controller/story.controller.js";

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video files allowed"));
  }

};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const storyRoutes = express.Router();

storyRoutes.post("/upload", identifyUser, upload.single("media"), uploadStory);
storyRoutes.get("/feed", identifyUser, getStories);
storyRoutes.post("/:storyId/view", identifyUser, viewStory);
storyRoutes.get("/:storyId/viewers", identifyUser, getStoryViewers);

export default storyRoutes;