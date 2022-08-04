<script lang="ts">
  import Button from "~lib/components/atoms/Button.svelte";
  import Flex from "~lib/components/atoms/Flex.svelte";
  import FormField from "~lib/components/atoms/FormField.svelte";
  import Input from "~lib/components/atoms/Input.svelte";
  import RadioField from "~lib/components/atoms/RadioField.svelte";
  import Stack from "~lib/components/atoms/Stack.svelte";
  import {
    addReferences,
    clearReferences,
    references,
  } from "~lib/stores/references";
  import parseTimeString from "~lib/utils/parseTimeString";
  import { navigatePage } from "~lib/utils/navigation";
  import { settings } from "~lib/stores/settings";
  import ReferenceDirectory from "~lib/components/molecules/ReferenceDirectory.svelte";
  import Modal from "~lib/components/atoms/Modal.svelte";
  import Glass from "~lib/components/atoms/Glass.svelte";
  import FileInput from "~lib/components/atoms/FileInput.svelte";
  import Spacer from "~lib/components/atoms/Spacer.svelte";
  import { getFilesFromDropEvent } from "~lib/utils/drop";

  const customDurationValue = "custom";
  const infiniteDurationValue = "infinite";
  const practiceDurations = ["30s", "1m", "1m30s", "2m", "5m", "1h"];
  let container: HTMLDivElement;
  let practiceDuration = practiceDurations[0];
  let customDuration = "1m30s";
  $: duration =
    practiceDuration === customDurationValue
      ? parseTimeString(customDuration)
      : practiceDuration === infiniteDurationValue
      ? Infinity
      : parseTimeString(practiceDuration);
  $: $settings.duration = duration;
  $: valid = $settings.duration !== 0 && $references.length > 0;

  let randomized: "true" | "false" = "true";
  $: $settings.randomized = randomized === "true";

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
    const splash = { x, y };
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
    <ReferenceDirectory />
  </div>
</div>
{#if startPracticeModal}
  <Modal
    onClose={toggleStartModal}
    onAccept={() => navigatePage("practice")}
    onAcceptLabel="Start canvas"
  >
    <Stack>
      <FormField label="Duration">
        <Stack>
          {#each practiceDurations as duration}
            <RadioField
              label={duration}
              bind:group={practiceDuration}
              value={duration}
            />
          {/each}
          <RadioField
            label="Custom"
            bind:group={practiceDuration}
            value={customDurationValue}
          >
            <Input
              bind:value={customDuration}
              disabled={practiceDuration !== customDurationValue}
            />
          </RadioField>
          <RadioField
            label="Disabled"
            bind:group={practiceDuration}
            value={infiniteDurationValue}
          />
        </Stack>
      </FormField>
      <FormField label="Randomized">
        <Stack>
          <RadioField label="Yes" bind:group={randomized} value="true" />
          <RadioField label="No" bind:group={randomized} value="false" />
        </Stack>
      </FormField>
    </Stack>
  </Modal>
{/if}

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: var(--spacing);
  }

  .directory-container {
    margin: var(--spacing);
  }

  .header-bar {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
