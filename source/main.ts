import "pwacompat";
import App from "./App.svelte";
import { registerSW } from "virtual:pwa-register";

new App({ target: document.body });

registerSW();
