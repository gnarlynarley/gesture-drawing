<script lang="ts">
  import Button from "~lib/components/atoms/Button.svelte";
  import Flex from "~lib/components/atoms/Flex.svelte";
  import {
    addReferences,
    clearReferences,
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

  let dragActive = false;

  async function handleDrop(ev: DragEvent) {
    ev.preventDefault();
    const rect = container.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    dragActive = false;
    const newFiles = await getFilesFromDropEvent(ev);
    addReferences(newFiles);
  }

  function handleDragOver(ev: DragEvent) {
    ev.preventDefault();
  }
  function handleDragEnter() {
    dragActive = true;
  }
  function handleDragLeave() {
    dragActive = false;
  }
</script>

<div
  class="container"
  bind:this={container}
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
>
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
    <ReferenceFileGrid references={$references} />
  </div>
</div>
{#if startPracticeModal}
  <SettingsModal
    onAccept={() => navigatePage("practice")}
    onClose={toggleStartModal}
  />
{/if}

<style lang="scss">
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
