<script lang="ts">
  import createBlobUrl from "../../utils/svelte/createBlobUrl";

  export let name: string | undefined = undefined;
  export let fit: "cover" | "contain" = "contain";
  export let file: Blob;
  export let alt: string = "";
  export let spread: boolean = false;
  $: src = createBlobUrl(file);
</script>

<div
  class="container"
  class:is-covering={fit === "cover"}
  class:is-spread={spread}
>
  {#if name}
    <span class="label">{name}</span>
  {/if}
  <img src={$src} {alt} class="image" loading="lazy" />
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
