import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const publicPath = "/gesture-drawing/";
const icons = [
  {
    src: "/android-icon-36x36.png",
    sizes: "36x36",
    type: "image/png",
    density: "0.75",
  },
  {
    src: "/android-icon-48x48.png",
    sizes: "48x48",
    type: "image/png",
    density: "1.0",
  },
  {
    src: "/android-icon-72x72.png",
    sizes: "72x72",
    type: "image/png",
    density: "1.5",
  },
  {
    src: "/android-icon-96x96.png",
    sizes: "96x96",
    type: "image/png",
    density: "2.0",
  },
  {
    src: "/android-icon-144x144.png",
    sizes: "144x144",
    type: "image/png",
    density: "3.0",
  },
  {
    src: "/android-icon-192x192.png",
    sizes: "192x192",
    type: "image/png",
    density: "4.0",
  },
].map((item) => ({
  ...item,
  src: `${publicPath}${item.src}`.replace("//", "/"),
}));

export default defineConfig({
  base: publicPath,
  root: path.resolve(__dirname, "./source"),
  build: {
    outDir: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: false,
      },
      manifest: {
        name: "Gesture practice",
        short_name: "Gesture",
        description: "Tool to help studying art with a timer",
        start_url: publicPath,
        display: "standalone",
        scope: publicPath,
        icons,
      },
    }),
    tsconfigPaths({
      root: __dirname,
    }),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true, emitCss: false })],
    }),
  ],
  server: {
    port: 4000,
  },
});
