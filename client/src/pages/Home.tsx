import React, { useEffect } from "react";
import { View, Pen, Trash2 } from "lucide-react";
import { Avatar, Card, Flex, Pagination, Modal, message, Input } from "antd";
import {
  getAllBlogs,
  deleteBlog as deleteBlogFn,
  IBlog,
} from "@/http/blog.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuthState } from "@/provider/auth.contex";
import useDocumentTitle from "@/hooks/useMeta";
import BlogCardSkeleton from "@/components/BlogSkeleton";

const Home: React.FC = () => {
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [deleteBlog, setDeleteBlog] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");

  const [blogs, setBlogs] = React.useState<IBlog[]>([]);

  const { user } = useAuthState();
  const navigate = useNavigate();

  useDocumentTitle("Inkspire");

  // Query for fetching the blogs
  const { data, isLoading, refetch } = useQuery(
    ["blogs", { page, limit }],
    () => getAllBlogs({ page, limit }),
    {
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (data?.data?.data.blogs) {
      setBlogs(data?.data?.data.blogs);
    }
  }, [data]);

  // Handle page and limit change
  const onPageChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  useEffect(() => {
    if (page && limit) {
      getAllBlogs({ page, limit });
    }
  }, [page, limit]);

  const { mutate } = useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: () => deleteBlogFn(id),
    onSuccess: (data) => {
      setDeleteBlog(false);
      refetch();
      message.success(data.data.message);
    },
    onError(error: AxiosError) {
      message.error((error.response?.data as { error: string }).error);
    },
  });

  const handleCancel = () => {
    setDeleteBlog(false);
  };

  return (
    <>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Pagination
          showSizeChanger
          current={page}
          pageSize={limit}
          total={data?.data?.data.total || 0} // Adjust total blogs based on your API response
          onChange={onPageChange}
          onShowSizeChange={onPageChange}
          showTotal={(total) => `Total ${total} blog`}
          className="py-5"
        />
        <Input.Search
          className="w-[300px]"
          placeholder="Search blogs"
          onChange={(e) => {
            const value = e.target.value;
            const filteredBlogs = data?.data?.data.blogs.filter((blog: IBlog) =>
              blog.title.toLowerCase().includes(value.toLowerCase())
            );
            setBlogs(filteredBlogs || []);
          }}
        />
      </div>
      <Modal
        title="Delete Blog"
        open={deleteBlog}
        onOk={() => mutate()}
        okType="danger"
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this blog?</p>
      </Modal>
      {/* Displaying Blogs */}
      <Flex
        gap="middle"
        align="start"
        wrap="wrap"
        justify="start"
        className="my-10"
      >
        {isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        {
          // Display a message if no blogs are available
          blogs.length === 0 && (
            <h1 className="text-3xl text-gray-600 font-roboto-regular">
              No Blogs Available
            </h1>
          )
        }
        {blogs?.map((blog) => (
          <Card
            loading={isLoading}
            actions={
              Object.keys(user).length
                ? [
                    <Link
                      to={`/blog/${blog.title.split(" ").join("-")}.${
                        blog._id
                      }`}
                    >
                      {" "}
                      <View size={20} className="mx-auto" />
                    </Link>,
                    <Trash2
                      size={20}
                      className="mx-auto"
                      onClick={() => {
                        setId(blog?._id || "");
                        setDeleteBlog(true);
                      }}
                    />,
                    <Link
                      to={`/edit-blog/${blog.title.split(" ").join("-")}.${
                        blog._id
                      }`}
                    >
                      <Pen size={20} className="mx-auto" />
                    </Link>,
                  ]
                : []
            }
            style={{ maxWidth: 420, margin: "0 10px 20px" }}
            hoverable={!Object.keys(user).length ? true : false}
            key={blog._id}
            onClick={
              !Object.keys(user).length
                ? () => {
                    navigate(`/blog/${blog.title}.${blog._id}`);
                  }
                : undefined
            }
            cover={
              <img
                className="h-[250px] w-full object-cover"
                src={blog.post_image || "https://via.placeholder.com/300"}
                alt="placeholder"
              />
            }
          >
            <Card.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
                    Math.random() * 100
                  }`}
                />
              }
              title={
                <h2 className="text-xl text-gray-600 capitalize font-roboto-regular">
                  {blog.title}
                </h2>
              }
              description={
                <p
                  className="h-[70px] overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html:
                      blog.content.length > 250
                        ? `${blog.content.trim().slice(0, 250)}...`
                        : blog.content.trim(),
                  }}
                />
              }
            />
          </Card>
        ))}
      </Flex>
    </>
  );
};

export default Home;
