import { fileURLToPath, URL } from "node:url";

// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";

// Utilities
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VitePWA({
      strategies: "injectManifest",
      injectRegister: "auto",
      srcDir: "public",
      filename: "serviceWorker.js",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,ico,woff,woff2,json,png,ttf}*"],
      },
    }),
  ],
  build: {
    outDir: "./dist",
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 8080,
  },
  test: {
    globals: true, // https://vitest.dev/config/#globals
  },
});
