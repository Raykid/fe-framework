/// <reference types="antd" />

import { StartUp } from "raydux";
import React from "react";
import { createRoot } from "react-dom/client";
import { Test } from "./pages/test";

createRoot(document.getElementById("root")!).render(
  <StartUp preload="Loading...">
    <Test />
  </StartUp>
);
