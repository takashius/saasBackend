"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: "User",
        required: [true, "A valid user is required to create a post."],
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Posts = (0, mongoose_1.model)("Posts", postSchema);
exports.default = Posts;
