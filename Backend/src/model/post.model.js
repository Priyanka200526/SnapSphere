import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    images: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


const PostModel = mongoose.model('Post', postSchema);
postSchema.index({ user: 1, createdAt: -1 });

export default PostModel;