<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    text?: string | null | undefined;
  };

  const { children, text }: Props = $props();
  const id = $props.id();
</script>

<div class="wrapper" style={`--anchor-name: --${id};`}>
  {@render children?.()}
  <div class="tooltip">
    {text}
  </div>
</div>

<style lang="scss">
  .wrapper {
    anchor-name: var(--anchor-name);
    display: block;
  }

  .tooltip {
    position-anchor: var(--anchor-name);
    position: fixed;
    top: anchor(bottom);
    justify-self: anchor-center;
    position-try-fallbacks:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    background: var(--color-primary);
    color: var(--color-primary-text);
    border-radius: var(--border-radius);
    padding: var(--gutter);
    pointer-events: none;
    margin: var(--gutter);
    white-space: nowrap;

    .wrapper:not(:hover) & {
      display: none;
      visibility: hidden;
    }
  }
</style>
