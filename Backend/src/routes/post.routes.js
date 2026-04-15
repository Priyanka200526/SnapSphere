import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import multer from "multer";
import { createPost, getUserPosts, getPostDetailsController, getFeed,deletePost,toggleLikePost } from "../controller/post.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const postRoutes = express.Router();

postRoutes.post("/", upload.array("images"), identifyUser, createPost)
postRoutes.delete("/delete/:postId", identifyUser, deletePost)
postRoutes.get("/", identifyUser, getUserPosts)
postRoutes.get("/details/:postid", identifyUser, getPostDetailsController)
postRoutes.post("/like/:postid", identifyUser, toggleLikePost)
postRoutes.get("/feed", identifyUser, getFeed)

export default postRoutes