import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const publicPath = "/gesture-drawing/";
const icons = [
  {
    src: `${publicPath}assets/16.png`,
    sizes: "16x16",
  },
  {
    src: `${publicPath}assets/20.png`,
    sizes: "20x20",
  },
  {
    src: `${publicPath}assets/29.png`,
    sizes: "29x29",
  },
  {
    src: `${publicPath}assets/32.png`,
    sizes: "32x32",
  },
  {
    src: `${publicPath}assets/40.png`,
    sizes: "40x40",
  },
  {
    src: `${publicPath}assets/50.png`,
    sizes: "50x50",
  },
  {
    src: `${publicPath}assets/57.png`,
    sizes: "57x57",
  },
  {
    src: `${publicPath}assets/58.png`,
    sizes: "58x58",
  },
  {
    src: `${publicPath}assets/60.png`,
    sizes: "60x60",
  },
  {
    src: `${publicPath}assets/64.png`,
    sizes: "64x64",
  },
  {
    src: `${publicPath}assets/72.png`,
    sizes: "72x72",
  },
  {
    src: `${publicPath}assets/76.png`,
    sizes: "76x76",
  },
  {
    src: `${publicPath}assets/80.png`,
    sizes: "80x80",
  },
  {
    src: `${publicPath}assets/87.png`,
    sizes: "87x87",
  },
  {
    src: `${publicPath}assets/100.png`,
    sizes: "100x100",
  },
  {
    src: `${publicPath}assets/114.png`,
    sizes: "114x114",
  },
  {
    src: `${publicPath}assets/120.png`,
    sizes: "120x120",
  },
  {
    src: `${publicPath}assets/128.png`,
    sizes: "128x128",
  },
  {
    src: `${publicPath}assets/144.png`,
    sizes: "144x144",
  },
  {
    src: `${publicPath}assets/152.png`,
    sizes: "152x152",
  },
  {
    src: `${publicPath}assets/167.png`,
    sizes: "167x167",
  },
  {
    src: `${publicPath}assets/180.png`,
    sizes: "180x180",
  },
  {
    src: `${publicPath}assets/192.png`,
    sizes: "192x192",
  },
  {
    src: `${publicPath}assets/256.png`,
    sizes: "256x256",
  },
  {
    src: `${publicPath}assets/512.png`,
    sizes: "512x512",
  },
  {
    src: `${publicPath}assets/1024.png`,
    sizes: "1024x1024",
  },
];

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
