<script lang="ts">
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
  };

  const { children }: Props = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger>
      {@render children?.()}
    </Tooltip.Trigger>
    <Tooltip.Content sideOffset={8}>
      <div class="tooltip">Make some magic!</div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<style>
  .tooltip {
    background: var(--color-primary);
    color: var(--color-primary-text);
    border-radius: var(--border-radius);
    padding: var(--gutter);
  }
</style>
