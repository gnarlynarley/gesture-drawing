<script lang="ts">
  import Button from "~lib/components/atoms/Button.svelte";
  import DropZone from "~lib/components/atoms/DropZone.svelte";
  import Flex from "~lib/components/atoms/Flex.svelte";
  import FormField from "~lib/components/atoms/FormField.svelte";
  import Input from "~lib/components/atoms/Input.svelte";
  import RadioField from "~lib/components/atoms/RadioField.svelte";
  import Stack from "~lib/components/atoms/Stack.svelte";
  import {
    references,
    isReference,
    addReferences,
  } from "~lib/stores/references";
  import parseTimeString from "~lib/utils/parseTimeString";
  import { navigatePage } from "~lib/utils/navigation";
  import { settings } from "~lib/stores/settings";
  import ReferenceDirectory from "~lib/components/molecules/ReferenceDirectory.svelte";
  import Modal from "~lib/components/atoms/Modal.svelte";

  const customDurationValue = "custom";
  const infiniteDurationValue = "infinite";
  const practiceDurations = ["30s", "1m", "1m30s", "2m", "5m", "1h"];
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

  let startPracticeModal = false;
  function toggleStartModal() {
    startPracticeModal = !startPracticeModal;
  }
</script>

<div class="container">
  <div class="drop-zone content">
    <DropZone isValidValue={isReference} onChange={addReferences}>
      <div class="directory-container">
        {#if $references.length > 0}
          <ReferenceDirectory />
        {:else}
          <h3 class="directory-container__label">
            No references were added, you can add them by dragging in your files
            or add down below
          </h3>
        {/if}
      </div>
    </DropZone>
  </div>
  <div class="button-bar content">
    <Flex>
      <Button variant="primary" disabled={!valid} onClick={toggleStartModal}>
        Start
      </Button>
    </Flex>
  </div>
</div>
{#if startPracticeModal}
  <Modal onClose={toggleStartModal}>
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
      <Flex>
        <Button
          variant="primary"
          disabled={!valid}
          onClick={() => navigatePage("practice")}
        >
          Start
        </Button>
      </Flex>
    </Stack>
  </Modal>
{/if}

<style lang="scss">
  .container {
    --spacing: 0.5em;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template:
      "main" 1fr
      "buttons" auto;
    grid-gap: var(--spacing);
    padding: var(--spacing);

    @media screen and (max-width: 40em) {
      grid-template:
        "main" 1fr
        "buttons" auto;
    }
  }

  .content {
    padding: var(--spacing);
  }

  .button-bar {
    grid-area: buttons;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .drop-zone {
    grid-area: main;
    flex: 1;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .directory-container {
    overflow: auto;
    width: 100%;
    height: 100%;
    display: grid;
    padding: var(--spacing);
    align-content: flex-start;
    justify-items: flex-start;

    &__label {
      justify-self: center;
      align-self: center;
      width: 80%;
      text-align: center;
    }
  }
</style>
