import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
const authRoutes = express.Router();

import { registerValidation, loginValidation } from "../validators/auth.validator.js";
import { sendOTPForRegistration, loginController, logoutController, getCurrentUser,updateProfile } from "../controller/auth.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { upload } from "../middleware/upload.js";

authRoutes.post("/register", registerValidation, validate, sendOTPForRegistration);
authRoutes.post("/login", loginValidation, validate, loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/getCurrentUser", identifyUser, getCurrentUser);
authRoutes.put("/updateprofile",identifyUser,upload.single("profileImage"),updateProfile);

export default authRoutes;