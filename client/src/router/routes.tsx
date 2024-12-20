import { Navigate, RouteObject } from "react-router-dom";
import { appRoutes } from "@/utils/paths";

import MainLayout from "@/layouts";

import Home from "@/pages/Home";
import NewBlog from "@/pages/NewBlog";
import Blog from "@/pages/Blog";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthLayout from "@/layouts/auth.layout";

import ProtectedRoute from "./Protected.routes";
import EditBlog from "@/pages/Edit";

const routesObject: RouteObject[] = [
  {
    path: appRoutes.auth.INDEX,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: appRoutes.auth.LOGIN,
        element: <Login />,
      },
      {
        path: appRoutes.auth.REGISTER,
        element: <Register />,
      },
    ],
  },
  {
    path: appRoutes.dashboard.INDEX,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ]
  },
  {
    path: appRoutes.dashboard.INDEX,
    element: <MainLayout />,
    children: [
      {
        path: appRoutes.dashboard.BLOG,
        element: <Blog />,
      },
      {
        path: appRoutes.dashboard.NEW_BLOG,
        element:<ProtectedRoute> <NewBlog /></ProtectedRoute>,
      },
      {
        path: appRoutes.dashboard.EDIT_BLOG,
        element:<ProtectedRoute> <EditBlog /></ProtectedRoute>,
      }
    ],
  },
  {
    path: appRoutes.FALSE_ROUTE,
    element: <Navigate to="/" />,
  },
];

export default routesObject;
