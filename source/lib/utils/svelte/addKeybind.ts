import { onDestroy } from "svelte";

const keyMap: Record<string, string> = {
  space: " ",
  esc: "Escape",
  left: "ArrowLeft",
  right: "ArrowRight",
};

export default function addKeybind(key: string, callback: () => void) {
  function keydownHandler(event: KeyboardEvent) {
    if (keyMap[key] === event.key || event.key === key) {
      callback();
    }
  }

  window.addEventListener("keydown", keydownHandler, false);

  onDestroy(() => {
    window.removeEventListener("keydown", keydownHandler);
  });
}
