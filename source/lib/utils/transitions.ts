import { fade, type TransitionConfig } from "svelte/transition";
import { quadOut } from "svelte/easing";

interface GrowParams {
  duration?: number;
}

function grow(node: HTMLElement, { duration = 400 }: GrowParams): TransitionConfig {
  const existingTransform = getComputedStyle(node)
    .transform.replace("none", "")
    .trim();

  return {
    easing: quadOut,
    duration: duration,
    css: (t) => {
      return `transform: ${existingTransform} scale(${t})`;
    },
  };
}

export { fade, grow };
