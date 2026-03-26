<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    toolbar?: Snippet;
    children?: Snippet;
    scroll?: boolean;
  };

  const { toolbar, children, scroll }: Props = $props();
</script>

<svelte:window {onkeydown} />

<div class="wrapper" class:scroll>
  {#if toolbar}
    <div class="toolbar">
      {@render toolbar()}
    </div>
  {/if}

  {@render children?.()}
</div>

<style>
  .wrapper {
    flex-grow: 1;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    width: 100%;

    &.scroll {
      overflow: auto;
    }
  }

  .toolbar {
    background-color: color-mix(
      in oklab,
      var(--color-background),
      transparent 8%
    );
    backdrop-filter: blur(8px);
    border-bottom: 2px solid var(--color-accent);
    padding: var(--gutter);
    display: flex;
    align-items: center;
    gap: var(--gutter);
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
