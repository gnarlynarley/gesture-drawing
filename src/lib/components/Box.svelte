<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    xl?: boolean;
  };

  const { children, xl }: Props = $props();
</script>

<div class="box" class:xl>
  {@render children?.()}
</div>

<style>
  .box {
    display: flex;
    flex-direction: column;
    gap: var(--gutter);
    border: 2px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: var(--gutter);
    background-color: var(--color-background);

    &.xl {
      gap: var(--spacing);
    }
  }
</style>
