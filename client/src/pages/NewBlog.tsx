/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { Input, Form, Upload, Button, message, Flex } from "antd";
import type { UploadProps } from "antd";
import { Upload as UploadIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { createBlog, getSignUrl } from "@/http/blog.api";

import RichTextEditor from "@/components/Editor";
import { AxiosError } from "axios";
import useDocumentTitle from "@/hooks/useMeta";

// Zod validation schema
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(50, "Content should be at least 50 characters"),
  post_image: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const NewBlog = () => {
  const [content, setContent] = React.useState<string>("");

  useDocumentTitle("New Blog");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: content,
      post_image: "",
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationKey: ["createBlog"],
    mutationFn: createBlog,
    onSuccess: () => {
      message.success("Blog post submitted successfully!");
      setContent("");
      reset();
    },
    onError: (error: AxiosError) => {
      message.error((error.response?.data as { error: string }).error);
    },
  });

  // Form submission handler
  const onSubmit = (data: BlogFormValues) => {
    mutate({
      title: data.title,
      content: data.content,
      post_image:
        "https://d3ophjhuruvmkf.cloudfront.net" +
          data.post_image?.split(".com")[1] || "",
    });
  };

  // Upload props for thumbnail
  const props: UploadProps = {
    name: "file",
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const File = file as File;

        // Step 1: Get the signed URL from your server
        const signUrl = await getSignUrl({
          filename: File.name,
          filetype: File.type,
        });

        const { signedUrl } = signUrl.data.data;

        // Step 2: Upload the file to S3 using the signed URL
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": (file as File).type,
          },
          body: file,
        });
        onSuccess && onSuccess("ok");
        if (uploadResponse.ok) {
          message.success("File uploaded successfully");

          // Get the image URL (without the query string)
          const imageUrl = signedUrl.split("?")[0];

          setValue("post_image", imageUrl);
        } else {
          throw new Error("File upload failed");
        }
      } catch (error) {
        console.error(error);
        onError && onError(error as Error);
        message.error("File upload failed");
      }
    },
  };

  return (
    <Flex gap="middle" className="mt-5 max-w-[800px] mx-auto" vertical>
      <h1 className="text-2xl font-[500] text-gray-700 font-roboto-regular">
        New Blog
      </h1>
      <Form
        name="basic"
        className="mt-5"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit(onSubmit)}
      >
        {
          // Post image validation
          errors.post_image && (
            <p className="text-red-500">{errors.post_image.message}</p>
          )
        }

        {
          // Post image preview
          watch("post_image") && (
            <img
              src={
                "https://d3ophjhuruvmkf.cloudfront.net" +
                watch("post_image")?.split(".com")[1]
              }
              alt="Post thumbnail"
              className="max-w-full min-h-[300px] max-h-[500px] object-cover rounded-lg mb-5"
            />
          )
        }

        {/* Thumbnail upload */}
        <Upload {...props}>
          <Button icon={<UploadIcon size="17" />}>Upload blog thumbnail</Button>
        </Upload>

        {/* Title input */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Title of the blog"
              className="mt-5"
              status={errors.title ? "error" : ""}
            />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Rich text editor */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              onChange={(newContent) => {
                setContent(newContent);
                field.onChange(newContent); // Sync form state with editor content
              }}
              initialValue={field.value || content} // Pass form value to editor
            />
          )}
        />

        {/* Content validation */}
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}

        {/* Post button */}
        <Button
          className="mt-5"
          type="primary"
          size="large"
          loading={isLoading}
          htmlType="submit"
        >
          Publish
        </Button>
      </Form>
    </Flex>
  );
};

export default NewBlog;
