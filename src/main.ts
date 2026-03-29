import { mount } from "svelte";
import App from "./App.svelte";
import "./lib/pwa";
import "./app.css";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
