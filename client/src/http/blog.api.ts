import http from "./index";

import { IAuthUser } from "./auth.api";

export interface IBlog {
  _id?: string;
  title: string;
  content: string;
  tags?: string[];
  post_image: string;
  author?: IAuthUser;
  createdAt?: string;
}

export interface Response {
  message: string;
  error?: string;
}

export const createBlog = (blog: IBlog) => {
  return http.post<Response>("/blog/create", { ...blog });
};

export const getAllBlogs = ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  return http.get<{
    data: {
      blogs: IBlog[];
      total: number;
    };
  }>("/blog/list", {
    params: {
      limit,
      page,
    },
  });
};

export const getBlog = (id: string) => {
  return http.get<{ data: IBlog }>("/blog/get/" + id);
};

export const getSignUrl = ({
  filename,
  filetype,
}: {
  filename: string;
  filetype: string;
}) => {
  return http.post<{ data: { signedUrl   : string } }>("/blog/generate-presigned-url", {
    filename,
    filetype,
  });
};


export const deleteBlog = (id: string) => {
  return http.delete<Response>("/blog/delete/" + id);
}

export const editBlog = ({id,blog}:{id: string, blog: IBlog}) => {
  return http.put<Response>("/blog/update/" + id, { ...blog });
}