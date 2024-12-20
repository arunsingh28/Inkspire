import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Flex ,Skeleton} from "antd";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import { getBlog } from "@/http/blog.api";

import useDocumentTitle from "@/hooks/useMeta";

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["blog", id?.split(".")[1]],
    queryFn: () => getBlog(id?.split(".")[1] || ""),
  });

  // title
  useDocumentTitle(data?.data.data.title + "| Inkspire" || "Blog | Inkspire");

  const createMarkup = (content: string) => {
    return {
      __html: DOMPurify.sanitize(content),
    };
  };

  return (
    <div className="my-5">
      <Button
        icon={<ArrowLeft size={20} />}
        type="link"
        onClick={() => navigate(-1)}
        className="sticky top-[80px]"
      >
        Go back
      </Button>
      {
        isLoading ? <Skeleton active={true} /> : 
        <div className="mx-auto max-w-3xl">
       <Flex justify="space-between" align="center">
       <h1 className="text-4xl text-gray-700 capitalize pb-5 pt-2 font-bold ">
          {data?.data.data.title}
        </h1>
        <Flex vertical gap="small" align="flex-end">
        <time className="text-gray-500 font-mono text-sm">
          {new Date(data?.data.data.createdAt || "").toDateString()}{" "}
          at {new Date(data?.data.data.createdAt || "").toLocaleTimeString()}
        </time>
        <p className="text-sm"> By : <span className="italic text-blue-500">{ data?.data.data.author?.name || data?.data.data.author?.email}</span></p>
        </Flex>
       </Flex>

        <div className="max-w-screen-xl mx-auto p-5 relative">
          <div
            className="h-64 text-center overflow-hidden shadow-md"
            style={{
              height: 450,
              backgroundImage: `url(${data?.data.data.post_image || "https://via.placeholder.com/450"})`,
              backgroundOrigin: "center",
              backgroundSize: "cover",
              backgroundPosition: "center",

            }}
            title="Woman holding a mug"
          ></div>
          <div className="max-w-2xl mx-auto mt-5">
            <div
            className="text-gray-700 font-poppins-regular"
              dangerouslySetInnerHTML={createMarkup(
                data?.data.data.content || ""
              )}
            />
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default Blog;
