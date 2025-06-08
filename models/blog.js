import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        selectedImage:{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        },
        title:{
            type: String,
            required:true,
        },
        subtitle:{
            type:String,
            required:true
        },
        content:{
            type: String,
            required:true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true
    }
);

export const Blog = mongoose.model("Blog", blogSchema);