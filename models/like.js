import mongoose from "mongoose";

const likeschema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Like = mongoose.models.Like||mongoose.model("Like", likeschema);