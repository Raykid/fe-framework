/// <reference types="antd" />

import "@/utils/vite-util";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import { App } from "antd";
import { StartUp } from "raydux";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.less";
import { Routes } from "./routes/routes";

createRoot(document.getElementById("root")!).render(
  <StartUp
    dynamicallyInitialize
    development={process.env.NODE_ENV === "development"}
    preload={
      <div className="preload">
        <LoadingOutlined className="preload-icon" />
        <div className="preload-text">Loadnig...</div>
      </div>
    }
  >
    <App className="antd-app">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </App>
  </StartUp>
);
