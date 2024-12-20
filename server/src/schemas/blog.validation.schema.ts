import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(10),
  post_image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const presignedUrlSchema = z.object({
  filename: z.string(),
  filetype: z.string(),
})

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type PresignedUrlInput = z.infer<typeof presignedUrlSchema>;
