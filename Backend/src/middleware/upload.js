// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// agar folder nahi hai, create karo
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: multer.memoryStorage(), // file buffer ke liye
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});