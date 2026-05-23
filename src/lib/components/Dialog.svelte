<script lang="ts">
  import Box from "./Box.svelte";
  import Button from "./Button.svelte";
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    button: Snippet;
    content: Snippet;
  };
  const { title, button, content }: Props = $props();
  const id = $props.id();
</script>

<button type="button" command="show-modal" commandfor={id}>
  {@render button()}
</button>

<dialog {id} closedby="any">
  <Box xl xlPadding>
    <header>
      <h1>{title}</h1>

      <button
        class="close-button"
        type="button"
        commandfor={id}
        command="close"
        aria-label="Close"
      >
        &times;
      </button>
    </header>
    {@render content()}
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
      backdrop-filter: blur(10px);
      background-color: color-mix(
        in srgb,
        var(--color-background),
        transparent 5%
      );
    }
  }

  header {
    display: flex;
    align-items: center;
  }

  .close-button {
    margin-left: auto;
    padding: var(--gutter);
    line-height: 1;
    border-radius: var(--border-radius);

    &:hover {
      background-color: var(--color-accent);
    }
  }
</style>
