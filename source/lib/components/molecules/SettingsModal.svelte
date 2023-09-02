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
  let minutes = Math.floor($settings.duration / 60);
  let seconds = $settings.duration % 60;
  let customDuration = "1m30s";
  let randomized = $settings.randomized;
  $: $settings.duration = minutes * 60 + seconds;
</script>

<Modal {onClose} {onAccept} onAcceptLabel="Start">
  <Stack>
    <FormField label="Duration">
      <Stack horizontal>
        <Input label="minutes" bind:value={minutes} />
        <Input label="seconds" bind:value={seconds} />
      </Stack>
    </FormField>
  </Stack>
</Modal>
