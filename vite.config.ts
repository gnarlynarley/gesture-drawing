import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { minimal2023Preset as preset } from "@vite-pwa/assets-generator/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svelte(),
    VitePWA({
      manifest: {
        name: "Gesture Drawing",
        description: "App for timed gesture drawing",
      },
      registerType: "prompt",
      injectRegister: "auto",
      devOptions: { enabled: true },
      pwaAssets: {
        preset,
        image: "public/logo.jpg",
      },
    }),
  ],
  base: "/gesture-drawing",
});
