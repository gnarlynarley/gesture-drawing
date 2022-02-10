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

  let element: HTMLElement;
  let intersecting = false;

  let once = false;
  onMount(() => {
    const pickedCanvas = element;
    if (!pickedCanvas) return;
    const observer = new IntersectionObserver(
      (entries) => {
        intersecting = entries.at(0)?.isIntersecting ?? false;
        if (intersecting && once) {
          observer.unobserve(pickedCanvas);
        }
      },
      { root: document.body },
    );
    observer.observe(pickedCanvas);

    return () => {
      observer.unobserve(pickedCanvas);
      observer.disconnect();
    };
  });
</script>

<div
  bind:this={element}
  class="container"
  class:is-covering={fit === "cover"}
  class:is-spread={spread}
>
  <span class="label">{file.name}</span>
  {#if intersecting}
    <img src={$src} {alt} class="image" loading="lazy" />
  {/if}
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
    text-shadow: 0 0 1px rgba(black, 0.5);
    padding: 0.5em;
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
