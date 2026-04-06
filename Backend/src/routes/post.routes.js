import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import multer from "multer";
import { createpostcontroller, getPostController, getPostDetailsController, likePostController, UnlikePostController, getFeedController } from "../controller/post.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const postRoutes = express.Router();

postRoutes.post("/", upload.array("images"), identifyUser, createpostcontroller)
postRoutes.get("/", identifyUser, getPostController)
postRoutes.get("/details/:postid", identifyUser, getPostDetailsController)
postRoutes.post("/like/:postid", identifyUser, likePostController)
postRoutes.delete("/unlike/:postid", identifyUser, UnlikePostController)
postRoutes.get("/feed", identifyUser,getFeedController)

export default  postRoutes