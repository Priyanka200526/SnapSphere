import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
const authRoutes = express.Router();

import { registerValidation, loginValidation } from "../validators/auth.validator.js";
import { sendOTPForRegistration, loginController, logoutController, getCurrentUser, updateProfile, getAllUsers, getUserById } from "../controller/auth.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { upload } from "../middleware/upload.js";

authRoutes.post("/register", registerValidation, validate, sendOTPForRegistration);
authRoutes.post("/login", loginValidation, validate, loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/getCurrentUser", identifyUser, getCurrentUser);
authRoutes.put("/updateprofile", identifyUser, upload.single("profileImage"), updateProfile);
authRoutes.get("/getAllUsers", identifyUser, getAllUsers);
authRoutes.get("/getUserById/:id", identifyUser, getUserById);

export default authRoutes;