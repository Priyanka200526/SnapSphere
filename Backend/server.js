import dotenv from "dotenv";
dotenv.config()

import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js"
import connectToDB from "./src/config/database.js";

// HTTP server
const server = http.createServer(app);

connectToDB()

// Socket server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// Socket logic
io.on("connection", (socket) => {

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log("User joined room:", userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// ONLY ONE EXPORT
export { io, server };

// Server listen
server.listen(3000, () => {
    console.log("Server running on 3000");
});