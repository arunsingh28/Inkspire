/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { Input, Form, Upload, Button, message, Flex , Skeleton} from "antd";
import type { UploadProps } from "antd";
import { Upload as UploadIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSignUrl, getBlog, editBlog } from "@/http/blog.api";

import RichTextEditor from "@/components/Editor";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import useDocumentTitle from "@/hooks/useMeta";

// Zod validation schema
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(50, "Content should be at least 50 characters"),
  post_image: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();



  const { data, isLoading: blogLoading } = useQuery({
    queryKey: ["blog-edit-fetch", id?.split(".")[1]],
    queryFn: () => getBlog(id?.split(".")[1] || ""),
  });

  useDocumentTitle(data?.data.data.title || "Edit Blog | Inkspire");

  const { mutate, isLoading } = useMutation({
    mutationKey: ["editBlog"],
    mutationFn: editBlog,
    onSuccess: (data) => {
      message.success(data.data.message);
    },
    onError: (error: AxiosError) => {
      message.error((error.response?.data as { error: string }).error);
    },
  });

  const [content, setContent] = React.useState<string>(
    data?.data.data.content || ""
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: data?.data.data.title || "",
      content: content,
      post_image: data?.data.data.post_image || "",
    },
  });

  React.useEffect(() => {
    if (data?.data.data.content) {
      setContent(data?.data.data.content);
      setValue("content", data?.data.data.content);
      setValue("title", data?.data?.data?.title ?? "");
      setValue("post_image", data?.data?.data?.post_image ?? "");
    }
  }, [data, setValue]);

  // Form submission handler
  const onSubmit = (data: BlogFormValues) => {
    console.log(data); // Handle form data here
    mutate({
      id: id?.split(".")[1] || "",
      blog: {
        title: data.title,
        content: data.content,
        post_image: data.post_image || "",
      },
    });
  };

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
        Edit Blog
      </h1>
      {
        blogLoading ? <Skeleton active={blogLoading} /> : <Form
        name="basic"
        className="mt-5"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit(onSubmit)}
      >
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
      }
    </Flex>
  );
};

export default EditBlog;
