<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ReferenceFile } from "~lib/stores/references";
  import resizeImageBlob from "~lib/utils/image/resizeImageBlob";

  export let reference: ReferenceFile;
  export let isScrolling = false;

  const IMAGE_WIDTH = 500;
  const IMAGE_HEIGHT = 500;
  let container: HTMLDivElement | undefined = undefined;
  let canvas: HTMLCanvasElement | undefined = undefined;
  let isIntersecting = false;
  const observer = new IntersectionObserver(([entry]) => {
    isIntersecting = entry?.isIntersecting ?? false;
  });

  onMount(() => {
    if (container) observer.observe(container);
  });
  onDestroy(() => {
    observer.disconnect();
  });

  let thumbnail: ImageData | null = null;
  let thumbnailPromise: Promise<void> | null = null;

  $: isVisible = !isScrolling && isIntersecting;
  $: {
    if (isVisible) {
      thumbnailPromise = resizeImageBlob(
        reference.file,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
      ).then((imageData) => {
        thumbnail = imageData;
      });
    }
  }
  $: {
    if (canvas && thumbnail) {
      canvas.getContext("2d")?.putImageData(thumbnail, 0, 0);
    }
  }
</script>

<div bind:this={container} class="container">
  {#if isVisible}
    <canvas
      bind:this={canvas}
      width={`${IMAGE_WIDTH}px`}
      height={`${IMAGE_HEIGHT}px`}
    />
  {/if}
</div>

<style lang="scss">
  .container {
    aspect-ratio: 1 / 1;
    background-color: var(--color-accent-300);
    border-radius: var(--spacing);
    overflow: hidden;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
