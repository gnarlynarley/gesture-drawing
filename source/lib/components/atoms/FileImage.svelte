<script lang="ts">
  import { onMount } from "svelte";
  import { clearCanvas, drawResizedImage } from "~lib/utils/image/canvas";
  import createImage from "~lib/utils/image/createImage";
  import createBlobUrl from "../../utils/svelte/createBlobUrl";

  export let fit: "cover" | "contain" = "contain";
  export let file: File;
  export let alt: string = "";
  export let spread: boolean = false;
  $: src = createBlobUrl(file);

  // let container: HTMLElement;
  // let intersecting = false;
  // let triggered = false;
  // $: {
  //   if (!triggered && intersecting) {
  //     triggered = true;
  //   }
  // }
  // $: imagePromise = $src && triggered ? createImage($src) : null;

  // let canvas: HTMLCanvasElement | null = null;
  // $: context = canvas?.getContext("2d") ?? null;
  // $: {
  //   imagePromise?.then((image) => {
  //     if (canvas && context) {
  //       drawResizedImage({ canvas, context, image, width: 300 });
  //     }
  //   });
  // }

  // let once = false;
  // onMount(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       intersecting = entries.at(0)?.isIntersecting ?? false;
  //       if (intersecting && once) {
  //         observer.unobserve(container);
  //       }
  //     },
  //     { root: document.body },
  //   );
  //   observer.observe(container);

  //   return () => {
  //     observer.unobserve(container);
  //     observer.disconnect();
  //   };
  // });
</script>

<div
  class="container"
  class:is-covering={fit === "cover"}
  class:is-spread={spread}
>
  <span class="label">{file.name}</span>
  <img src={$src} {alt} class="image" loading="lazy" />
  <!-- {#if intersecting}
    <canvas bind:this={canvas} title={alt} class="image" />
  {/if} -->
</div>

<style lang="scss">
  .container {
    object-fit: contain;
    background-color: var(--color-accent-200);

    &.is-spread {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .label {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    font-size: 0.7em;
    text-shadow: 0 2px 1px rgba(black, 0.5);
    padding: 0.5em;
    text-align: left;
    background: rgba(black, 0.2);
  }
  .image {
    .is-covering & {
      object-fit: cover;
    }

    .is-spread & {
      width: 100%;
      height: 100%;
    }
  }
</style>
