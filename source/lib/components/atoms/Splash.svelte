<script lang="ts">
  import { onDestroy } from "svelte";
  import { grow, fade } from "../../utils/transitions";

  export let duration: number;
  export let x: number;
  export let y: number;
  export let onDone: () => void;

  const timeoutId = setTimeout(() => {
    onDone();
  }, duration);

  onDestroy(() => {
    clearTimeout(timeoutId);
    onDone();
  });
</script>

<span
  in:grow={{ duration }}
  out:fade
  style={`left: ${x}px; top: ${y}px`}
  class="splash"
/>

<style lang="scss">
  .splash {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%) scale(1);
    border-radius: 50%;
    background-color: var(--color-primary);
    display: block;
    width: 314%;
    transition: 150ms ease-in-out;
    transition-property: opacity, transform;
    will-change: opacity, transform;
    opacity: 0.5;

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    }
  }
</style>
