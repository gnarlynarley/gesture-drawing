<script lang="ts">
  import Box from "./Box.svelte";
  import Button from "./Button.svelte";
  import type { Snippet } from "svelte";

  type Props = {
    button: Snippet;
    content: Snippet;
  };
  const { button, content }: Props = $props();
  const id = $props.id();
</script>

<button type="button" command="show-modal" commandfor={id}>
  {@render button()}
</button>

<dialog {id} closedby="any">
  <Box xl xlPadding>
    {@render content()}

    <div class="close-button">
      <Button type="button" commandfor={id} command="close">Close</Button>
    </div>
  </Box>
</dialog>

<style lang="scss">
  dialog {
    background: var(--color-background);
    color: currentColor;
    border: none;
    max-width: 60em;
    padding: 0;
    background: transparent;

    &::backdrop {
      backdrop-filter: blur(3px);
      background-color: color-mix(
        in srgb,
        var(--color-background),
        transparent 10%
      );
    }
  }

  .close-button {
    margin-left: auto;
  }
</style>
