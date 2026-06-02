import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    type: {
        type: String,
        enum: [
            "follow_request",
            "follow",
            "follow_accepted",
            "like",
            "comment"
        ]
    },

    followId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
        default: null
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },

    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const notificationModel = mongoose.model("notification",notificationSchema);

export default notificationModel