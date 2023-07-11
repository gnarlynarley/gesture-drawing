<script lang="ts">
  import Button from "~lib/components/atoms/Button.svelte";
  import Flex from "~lib/components/atoms/Flex.svelte";
  import {
    addReferences,
    clearReferences,
    removeReference,
    references,
  } from "~lib/stores/references";
  import { settings } from "~lib/stores/settings";
  import Modal from "~lib/components/atoms/Modal.svelte";
  import Glass from "~lib/components/atoms/Glass.svelte";
  import FileInput from "~lib/components/atoms/FileInput.svelte";
  import Spacer from "~lib/components/atoms/Spacer.svelte";
  import { getFilesFromDropEvent } from "~lib/utils/drop";
  import SettingsModal from "~lib/components/molecules/SettingsModal.svelte";
  import { navigatePage } from "~lib/utils/navigation";
  import ReferenceFileGrid from "~lib/components/organisms/ReferenceFileGrid.svelte";

  let container: HTMLDivElement;
  $: valid = $settings.duration !== 0 && $references.length > 0;

  let startPracticeModal = false;
  let showClearReferenceModal = false;
  function toggleStartModal() {
    startPracticeModal = !startPracticeModal;
  }

  let dragCounter = 0;
  $: dragActive = dragCounter > 0;

  async function handleDrop(ev: DragEvent) {
    ev.preventDefault();
    const newFiles = await getFilesFromDropEvent(ev);
    dragCounter = 0;
    addReferences(newFiles);
  }

  function handleDragOver(ev: DragEvent) {
    ev.preventDefault();
  }
  function handleDragEnter(ev: DragEvent) {
    dragCounter += 1;
  }
  function handleDragLeave(ev: DragEvent) {
    dragCounter -= 1;
  }

  $: document.body.style.pointerEvents = dragActive ? "none" : "";
</script>

<svelte:window
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
/>

<div class="container" bind:this={container}>
  {#if dragActive}
    <div class="drag-overlay">
      <span>Drop files and folders to add</span>
    </div>
  {/if}
  {#if showClearReferenceModal}
    <Modal
      onClose={() => (showClearReferenceModal = false)}
      onAccept={clearReferences}
      onAcceptLabel="Clear references"
    >
      Are you sure you want to remove all reference files?
    </Modal>
  {/if}
  <div class="header-bar">
    <Glass>
      <Flex>
        <FileInput onChange={addReferences} label="Add files" />
        <Button
          variant="transparent"
          onClick={() => (showClearReferenceModal = true)}>Clear</Button
        >
        <Spacer />
        <Button variant="primary" disabled={!valid} onClick={toggleStartModal}>
          Start
        </Button>
      </Flex>
    </Glass>
  </div>
  <div class="directory-container">
    <ReferenceFileGrid
      references={$references}
      onReferenceDeleteClick={removeReference}
    />
  </div>
</div>
{#if startPracticeModal}
  <SettingsModal
    onAccept={() => navigatePage("practice")}
    onClose={toggleStartModal}
  />
{/if}

<style lang="scss">
  .container {
    min-height: 100vh;
    position: relative;
    z-index: 0;
  }

  .drag-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: color-mix(in lab, var(--color-background), transparent 10%);
    z-index: 2;
    pointer-events: none;

    span {
      padding: 5em;
      display: block;
      width: calc(100% - (var(--offset) * 2));
      height: calc(100% - (var(--offset) * 2));
      border: 1px dashed currentColor;
      border-radius: 0.3em;
    }
  }

  .directory-container {
    margin: var(--spacing);
  }

  .header-bar {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    padding: var(--spacing);
  }
</style>
