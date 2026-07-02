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
  console.log("Checking mimetype:", file.mimetype); // ye add karo debug ke liye
  
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm"
  ];

  const baseMimeType = file.mimetype.split(";")[0].trim();
  console.log("Base mimetype:", baseMimeType); // ye bhi

  if (allowedTypes.includes(baseMimeType)) {
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
storyRoutes.post("/upload",
  identifyUser,
  (req, res, next) => {
    upload.single("media")(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err); // ye zaroor print karega
        return res.status(400).json({ status: false, message: err.message });
      }
      next();
    });
  },
  uploadStory
);
storyRoutes.get("/feed", identifyUser, getStories);
storyRoutes.post("/:storyId/view", identifyUser, viewStory);
storyRoutes.get("/:storyId/viewers", identifyUser, getStoryViewers);

export default storyRoutes;