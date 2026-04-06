import express from "express";
import { verifyOTPAndRegister } from "../controller/otp.controller.js";
import { isLoggedIn } from "../middleware/IsLoggedIn.middleware.js";

const otpRoutes = express.Router();

otpRoutes.post("/verify-otp",isLoggedIn, verifyOTPAndRegister);

export default otpRoutes;