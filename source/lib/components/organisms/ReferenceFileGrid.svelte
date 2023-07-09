<script lang="ts">
  import type { ReferenceFile } from "~lib/stores/references";
  import ReferenceFileThumbnail from "../molecules/ReferenceFileThumbnail.svelte";
  import Stack from "../atoms/Stack.svelte";
  import { onDestroy } from "svelte";

  export let references: ReferenceFile[];

  let container: HTMLDivElement | undefined = undefined;
  let containerHeight: string | null = null;
  let timeoutId: number | null = null;
  let isScrolling = false;
  const abortController = new AbortController();

  window.addEventListener(
    "scroll",
    () => {
      isScrolling = true;
      if (container) {
        containerHeight = `${container.offsetHeight}px`;
      }
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isScrolling = false;
        containerHeight = null;
      }, 150);
    },
    { signal: abortController.signal },
  );

  onDestroy(() => {
    abortController.abort();
  });
</script>

<div class="container" bind:this={container} style:height={containerHeight}>
  <Stack>
    <h3>References ({references.length})</h3>
    <div class="grid">
      {#each references as reference (reference.id)}
        <ReferenceFileThumbnail {isScrolling} {reference} />
      {/each}
    </div>
  </Stack>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
    gap: var(--spacing);
  }
</style>
