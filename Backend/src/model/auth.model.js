import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    bio: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: process.env.DEFAULT_PROFILE_IMAGE ||
            "https://ik.imagekit.io/ugywijw7c/download.png?updatedAt=1771150770486"
    },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });


authSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});


authSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const authModel = mongoose.model("User", authSchema);
export default authModel;