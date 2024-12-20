import { Schema, model, Document, ObjectId } from "mongoose";

import { collectionName as userCollectionName } from "./user.model";

export interface IBlog extends Document {
  title: string;
  content: string;
  post_image?: string;
  author: ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: userCollectionName, // Reference to the User model
      required: [true, "Author is required"],
    },
    tags: [{ type: [String], default: [] }],
    post_image: { type: String },
  },
  { timestamps: true }
);

const collectionName = "blogs";

const BlogModel = model<IBlog>(collectionName, BlogSchema);
export { BlogModel, collectionName };
