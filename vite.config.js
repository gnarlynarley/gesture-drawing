import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const icons = [
  {
    src: "/assets/16.png",
    sizes: "16x16",
  },
  {
    src: "/assets/20.png",
    sizes: "20x20",
  },
  {
    src: "/assets/29.png",
    sizes: "29x29",
  },
  {
    src: "/assets/32.png",
    sizes: "32x32",
  },
  {
    src: "/assets/40.png",
    sizes: "40x40",
  },
  {
    src: "/assets/50.png",
    sizes: "50x50",
  },
  {
    src: "/assets/57.png",
    sizes: "57x57",
  },
  {
    src: "/assets/58.png",
    sizes: "58x58",
  },
  {
    src: "/assets/60.png",
    sizes: "60x60",
  },
  {
    src: "/assets/64.png",
    sizes: "64x64",
  },
  {
    src: "/assets/72.png",
    sizes: "72x72",
  },
  {
    src: "/assets/76.png",
    sizes: "76x76",
  },
  {
    src: "/assets/80.png",
    sizes: "80x80",
  },
  {
    src: "/assets/87.png",
    sizes: "87x87",
  },
  {
    src: "/assets/100.png",
    sizes: "100x100",
  },
  {
    src: "/assets/114.png",
    sizes: "114x114",
  },
  {
    src: "/assets/120.png",
    sizes: "120x120",
  },
  {
    src: "/assets/128.png",
    sizes: "128x128",
  },
  {
    src: "/assets/144.png",
    sizes: "144x144",
  },
  {
    src: "/assets/152.png",
    sizes: "152x152",
  },
  {
    src: "/assets/167.png",
    sizes: "167x167",
  },
  {
    src: "/assets/180.png",
    sizes: "180x180",
  },
  {
    src: "/assets/192.png",
    sizes: "192x192",
  },
  {
    src: "/assets/256.png",
    sizes: "256x256",
  },
  {
    src: "/assets/512.png",
    sizes: "512x512",
  },
  {
    src: "/assets/1024.png",
    sizes: "1024x1024",
  },
];

export default defineConfig({
  base: "/gesture-drawing/",
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
      includeAssets: ["favicon.ico", ...icons.map((icon) => icon.src)],
      manifest: {
        name: "Study Canvas",
        short_name: "Study Canvas",
        description: "Tool to help studying art with a timer",
        theme_color: "#1b1a1a",
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
});
