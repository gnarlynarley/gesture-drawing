import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  base: "/gesture-drawing/",
  root: path.resolve(__dirname, "./source"),
  build: {
    outDir: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    tsconfigPaths({
      root: __dirname,
    }),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true, emitCss: false })],
    }),
  ],
});
