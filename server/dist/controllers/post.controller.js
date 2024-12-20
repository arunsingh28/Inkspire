"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const response_util_1 = require("../utils/response.util");
const blog_model_1 = require("../models/blog.model");
const aws_1 = require("../config/aws");
const mongoose_1 = __importDefault(require("mongoose"));
class PostController {
    async create(req, res, next) {
        try {
            const { title, content, tags, post_image } = req.body;
            const blog = new blog_model_1.BlogModel({
                title,
                content,
                tags,
                post_image,
                author: req.user.id,
            });
            await blog.save();
            (0, response_util_1.successResponse)(res, { message: "Blog created successfully" }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const blogs = await blog_model_1.BlogModel.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                { $unwind: "$author" },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        tags: 1,
                        post_image: 1,
                        createdAt: 1,
                        author: {
                            email: 1,
                            _id: 1,
                        },
                    },
                },
                { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
                { $skip: (+page - 1) * +limit }, // Skip the number of documents based on the page and limit
                { $limit: +limit }, // Limit the number of documents
                {
                    $facet: {
                        blogs: [
                            { $match: {} },
                            { $skip: (+page - 1) * +limit },
                            { $limit: +limit },
                        ],
                        total: [{ $count: "total" }],
                    },
                },
            ]);
            const result = {
                blogs: blogs[0]?.blogs || [],
                total: blogs[0]?.total[0]?.total || 0,
            };
            console.log(result);
            (0, response_util_1.successResponse)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await blog_model_1.BlogModel.findByIdAndDelete(id);
            (0, response_util_1.successResponse)(res, { message: "Blog deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            await blog_model_1.BlogModel.findByIdAndUpdate(id, { title, content });
            (0, response_util_1.successResponse)(res, { message: "Blog updated successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async get(req, res, next) {
        try {
            const { id } = req.params;
            console.log(id);
            const [blog] = await blog_model_1.BlogModel.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                { $unwind: "$author" },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        tags: 1,
                        post_image: 1,
                        createdAt: 1,
                        author: {
                            email: 1,
                            _id: 1,
                        },
                    },
                },
            ]);
            console.log(blog);
            (0, response_util_1.successResponse)(res, blog);
        }
        catch (error) {
            next(error);
        }
    }
    async generatePresignedUrl(req, res, next) {
        const { filename, filetype } = req.body;
        console.log(filename, filetype);
        const s3Params = {
            Bucket: "project-inkspire-blog", // S3 bucket name
            Key: `uploads/${filename}`, // The key (path) for the file in S3
            Expires: 60 * 60 * 5,
            ContentType: filetype, // Content type for the file (e.g., 'image/jpeg')
        };
        try {
            const { s3 } = aws_1.AWSConfig.getInstance();
            // Generate the pre-signed URL
            const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);
            console.log(signedUrl);
            (0, response_util_1.successResponse)(res, { signedUrl });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PostController = PostController;
