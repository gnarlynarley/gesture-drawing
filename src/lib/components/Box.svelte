<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    xl?: boolean;
    xlPadding?: boolean;
  };

  const { children, xl, xlPadding }: Props = $props();
</script>

<div class="box" class:xl class:xlPadding>
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

    &.xlPadding {
      padding: var(--spacing);
    }
  }
</style>
