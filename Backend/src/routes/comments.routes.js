import express from "express"
import identifyUser from "../middleware/auth.middleware.js";
import {addComment,getComments,deleteComment,commentCount} from '../controller/comments.controller.js'

const commentRoutes = express.Router()

commentRoutes.post("/:postId", identifyUser, addComment);
commentRoutes.get("/:postId", identifyUser, getComments);
commentRoutes.delete("/:commentId", identifyUser, deleteComment);
commentRoutes.get("/count/:postId", identifyUser, commentCount);

export default commentRoutes;