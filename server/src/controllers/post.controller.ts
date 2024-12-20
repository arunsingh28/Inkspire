import { NextFunction, Request, Response } from "express";

import { successResponse } from "../utils/response.util";

import {
  CreateBlogInput,
  PresignedUrlInput,
} from "../schemas/blog.validation.schema";

import { BlogModel } from "../models/blog.model";

import { AWSConfig } from "../config/aws";

import { CustomedRequest } from "../middlewares/auth.middleware";
import mongoose from "mongoose";

export class PostController {
  async create(req: CustomedRequest, res: Response, next: NextFunction) {
    try {
      const { title, content, tags, post_image } = req.body as CreateBlogInput;
      const blog = new BlogModel({
        title,
        content,
        tags,
        post_image,
        author: req.user.id,
      });
      await blog.save();
      successResponse(res, { message: "Blog created successfully" }, 201);
    } catch (error) {
      next(error);
    }
  }
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const blogs = await BlogModel.aggregate([
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

      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await BlogModel.findByIdAndDelete(id);
      successResponse(res, { message: "Blog deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content } = req.body as CreateBlogInput;
      await BlogModel.findByIdAndUpdate(id, { title, content });
      successResponse(res, { message: "Blog updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(id);
      const [blog] = await BlogModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
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
      successResponse(res, blog);
    } catch (error) {
      next(error);
    }
  }

  async generatePresignedUrl(req: Request, res: Response, next: NextFunction) {
    const { filename, filetype } = req.body as PresignedUrlInput;
    console.log(filename, filetype);
    const s3Params = {
      Bucket: "project-inkspire-blog", // S3 bucket name
      Key: `uploads/${filename}`, // The key (path) for the file in S3
      Expires: 60 * 60 * 5,
      ContentType: filetype, // Content type for the file (e.g., 'image/jpeg')
    };

    try {
      const { s3 } = AWSConfig.getInstance();
      // Generate the pre-signed URL
      const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);
      console.log(signedUrl);
      successResponse(res, { signedUrl });
    } catch (error) {
      next(error);
    }
  }
}
