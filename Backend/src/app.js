import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../src/routes/auth.routes.js";
import otpRoutes from "../src/routes/otp.routes.js";
import postRoutes from "../src/routes/post.routes.js";
import followRoutes from "../src/routes/follow.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/post", postRoutes);
app.use("/api/follow", followRoutes);

app.use(errorHandler);
export default app;