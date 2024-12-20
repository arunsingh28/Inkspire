import http from "./index";

import { Response } from "./blog.api";

export interface IUser {
  email: string;
  password: string;
  name?: string;
}

export type IAuthUser = Omit<IUser, "password">;

export interface AuthResponse extends Response {
  token: string;
  data: {
    user: IAuthUser;
  };
}

export const registerUser = (user: IUser) => {
  return http.post<Response>("/auth/register", { ...user });
};

export const loginUser = (user: IUser) => {
  return http.post<AuthResponse>("/auth/login", { ...user });
};
