"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionName = exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const BlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [5, "Title must be at least 5 characters long"],
        maxLength: [255, "Title must be at most 255 characters long"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        minLength: [20, "Content must be at least 5 characters long"],
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.collectionName, // Reference to the User model
        required: [true, "Author is required"],
    },
    tags: [{ type: [String], default: [] }],
    post_image: { type: String },
}, { timestamps: true });
const collectionName = "blogs";
exports.collectionName = collectionName;
const BlogModel = (0, mongoose_1.model)(collectionName, BlogSchema);
exports.BlogModel = BlogModel;
