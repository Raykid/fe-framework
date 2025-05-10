import react from "@vitejs/plugin-react";
import { getPort } from "portfinder-sync";
import { defineConfig } from "vite";
import fs from "fs";
import { fileURLToPath, URL } from "node:url";
import { viteStaticCopy } from "vite-plugin-static-copy";
// HTTPS 打开下面一行
// import mkcert from "vite-plugin-mkcert";

export default defineConfig(() => {
  const port = getPort(1301);
  const STATIC_PATH = "public";

  return {
    build: {
      outDir: "./build",
    },
    base: process.env.PUBLIC_URL || "/",
    define: {
      // XXX: JSON.stringify("xxx"),
    },
    plugins: [
      react(),
      // HTTPS 打开下面一行
      // mkcert(),
      ...(fs.existsSync(STATIC_PATH)
        ? [
            viteStaticCopy({
              targets: [
                {
                  src: STATIC_PATH,
                  dest: "/",
                },
              ],
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port,
      strictPort: true,
      // HTTPS 打开下面一行
      // https:{},
      open: true,
      proxy: {},
    },
  };
});
