import react from "@vitejs/plugin-react";
import { getPort } from "portfinder-sync";
import { defineConfig } from "vite";

const port = getPort(1301);

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    open: true,
  },
});
