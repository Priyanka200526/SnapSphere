import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
const authRoutes = express.Router();

import { registerValidation, loginValidation } from "../validators/auth.validator.js";
import { sendOTPForRegistration, loginController, logoutController, getMe,updateProfile } from "../controller/auth.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { upload } from "../middleware/upload.js";
import { isLoggedIn } from "../middleware/IsLoggedIn.middleware.js";

authRoutes.post("/register",isLoggedIn, registerValidation, validate, sendOTPForRegistration);
authRoutes.post("/login", loginValidation, validate, loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/getme", identifyUser, getMe);
authRoutes.put("/update-profile",identifyUser,upload.single("profileImage"),updateProfile);
export default authRoutes;