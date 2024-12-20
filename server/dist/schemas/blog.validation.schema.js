"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignedUrlSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(50),
    content: zod_1.z.string().min(10),
    post_image: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.presignedUrlSchema = zod_1.z.object({
    filename: zod_1.z.string(),
    filetype: zod_1.z.string(),
});
