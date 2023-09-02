<script lang="ts">
  import type { ReferenceFile } from "~lib/stores/references";
  import ReferenceFileThumbnail from "../molecules/ReferenceFileThumbnail.svelte";
  import Stack from "../atoms/Stack.svelte";
  import { onDestroy } from "svelte";
  import Modal from "../atoms/Modal.svelte";
  import FileImage from "../atoms/FileImage.svelte";

  export let references: ReferenceFile[];
  export let onReferenceDeleteClick: (reference: ReferenceFile) => void;

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

  let selectedReference: ReferenceFile | null = null;

  function openReferenceModal(nextReference: ReferenceFile) {
    selectedReference = nextReference;
  }
  function closeReferenceModal() {
    selectedReference = null;
  }
</script>

<div class="container" bind:this={container} style:height={containerHeight}>
  {#if selectedReference !== null}
    <Modal onClose={closeReferenceModal} full>
      <FileImage file={selectedReference.file} spread fit="contain" />
    </Modal>
  {/if}
  <Stack>
    <h3>References ({references.length})</h3>
    <div class="grid">
      {#each references as reference (reference.id)}
        <ReferenceFileThumbnail
          on:click={() => openReferenceModal(reference)}
          {isScrolling}
          {reference}
          onReferenceDeleteClick={() => onReferenceDeleteClick(reference)}
        />
      {/each}
    </div>
  </Stack>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
    gap: var(--spacing);
    width: 100%;
  }
</style>