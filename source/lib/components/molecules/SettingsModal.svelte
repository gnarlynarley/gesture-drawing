<script lang="ts">
  import { settings } from "~lib/stores/settings";
  import Modal from "../atoms/Modal.svelte";
  import Stack from "../atoms/Stack.svelte";
  import FormField from "../atoms/FormField.svelte";
  import Input from "../atoms/Input.svelte";
  import Box from "../atoms/Box.svelte";
  import Button from "../atoms/Button.svelte";
  import Flex from "../atoms/Flex.svelte";

  export let onClose: () => void;
  export let onAccept: () => void;

  let minutes = Math.floor($settings.duration / 60);
  let seconds = $settings.duration % 60;
  $: $settings.duration = minutes * 60 + seconds;
</script>

<Modal {onClose}>
  <Box>
    <Stack>
      <FormField label="Duration">
        <Stack horizontal>
          <Input label="minutes" bind:value={minutes} />
          <Input label="seconds" bind:value={seconds} />
        </Stack>
      </FormField>
    </Stack>

    <div class="buttons">
      <Button variant="transparent" onClick={onClose}>Cancel</Button>
      <Button
        variant="primary"
        onClick={() => {
          onAccept?.();
          onClose();
        }}
      >
        Start
      </Button>
    </div>
  </Box>
</Modal>

<style lang="scss">
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>