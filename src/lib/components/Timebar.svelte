<script lang="ts">
  import clamp from "../utils/clamp";

  type Props = {
    totalTime: number;
    currentTime: number;
  };

  const { totalTime, currentTime }: Props = $props();
  const percentage = $derived(clamp(0, 1, currentTime / totalTime));
</script>

<div
  class="bar"
  style={`--time:${percentage.toFixed(5)}`}
  class:done={percentage === 1}
></div>

<style>
  .bar {
    --time: 1;
    height: 0.3em;
    position: relative;
    background: color-mix(in srgb, var(--color-primary), transparent);

    &.done {
      box-shadow: 0 0 10px var(--color-primary);
      animation: 1s pulse alternate infinite;
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
      scale: var(--time) 1;
      background: var(--color-primary);
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
