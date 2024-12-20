export const appRoutes = {
  auth: {
    INDEX: "/auth",
    LOGIN: "login",
    REGISTER: "register",
  },
  dashboard: {
    INDEX: "/",
    NEW_BLOG: "new-post",
    BLOG: "blog/:id",
    EDIT_BLOG: "edit-blog/:id",
  },
  FALSE_ROUTE: "*",
};
