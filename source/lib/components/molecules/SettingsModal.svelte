<script lang="ts">
  import { settings } from "~lib/stores/settings";
  import parseTimeString from "~lib/utils/parseTimeString";
  import Modal from "../atoms/Modal.svelte";
  import Stack from "../atoms/Stack.svelte";
  import FormField from "../atoms/FormField.svelte";
  import RadioField from "../atoms/RadioField.svelte";
  import Input from "../atoms/Input.svelte";

  export let onClose: () => void;
  export let onAccept: () => void;

  const customDurationValue = "custom";
  const infiniteDurationValue = "infinite";
  const practiceDurations = ["30s", "1m", "1m30s", "2m", "5m", "1h"];
  let practiceDuration = practiceDurations[0];
  let customDuration = "1m30s";
  let randomized = $settings.randomized;
  $: duration =
    practiceDuration === customDurationValue
      ? parseTimeString(customDuration)
      : practiceDuration === infiniteDurationValue
      ? Infinity
      : parseTimeString(practiceDuration);
  $: $settings.duration = duration;
</script>

<Modal
  onClose={onClose}
  onAccept={onAccept}
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
        <input type="checkbox" bind:checked={randomized} />
      </Stack>
    </FormField>
  </Stack>
</Modal>
