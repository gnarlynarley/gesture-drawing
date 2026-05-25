import { mount } from "svelte";
import App from "./App.svelte";
import "./lib/pwa";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
