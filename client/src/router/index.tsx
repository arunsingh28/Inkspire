import {useRoutes } from "react-router-dom";
import routesObject from "./routes";


export const Routes = () => {
  const routes = useRoutes(routesObject);
  return routes;
};
