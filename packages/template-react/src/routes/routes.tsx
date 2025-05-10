import { Test } from "@/pages/test";
import React, { FC } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/web" replace />,
  },
  {
    path: "/web",
    children: [
      {
        index: true,
        element: <Navigate to="test" replace />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const Routes: FC = () => {
  return useRoutes(routes);
};
