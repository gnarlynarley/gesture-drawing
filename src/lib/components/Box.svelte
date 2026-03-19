<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="box">
  {@render children?.()}
</div>

<style>
  .box {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: var(--gutter);
    background-color: var(--color-background);
  }
</style>
