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
  let thumbnailLoading = true;

  $: isVisible = !isScrolling && isIntersecting;
  $: {
    if (isVisible) {
      thumbnailPromise = resizeImageBlob(
        reference.file,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
      ).then((imageData) => {
        thumbnail = imageData;
        thumbnailLoading = false;
      });
    }
  }
  $: {
    if (canvas && thumbnail) {
      canvas.getContext("2d")?.putImageData(thumbnail, 0, 0);
    }
  }
</script>

<div
  bind:this={container}
  class="container"
  class:is-loading={isVisible && thumbnailLoading}
>
  {#if isVisible}
    <canvas
      bind:this={canvas}
      width={`${IMAGE_WIDTH}px`}
      height={`${IMAGE_HEIGHT}px`}
    />
    <span class="name">{reference.name}</span>
  {/if}
</div>

<style lang="scss">
  .container {
    position: relative;
    aspect-ratio: 1 / 1;
    background-color: var(--color-accent-300);
    border-radius: var(--spacing);
    overflow: hidden;

    &.is-loading {
      animation: is-loading 1s ease-in-out infinite;
    }
  }

  @keyframes is-loading {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(black, 0.5);
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>