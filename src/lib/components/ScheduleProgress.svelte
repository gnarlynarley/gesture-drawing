<script lang="ts" generics="T">
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import { HourglassIcon } from "@lucide/svelte";

  const OVERFLOW_AMOUNT = 5;

  type Props = {
    previous: QueueItem<T>[];
    next: QueueItem<T>[];
    current: QueueItem<T> | null;
  };
  const { previous, next, current }: Props = $props();
  const items = $derived(previous.concat(next));
  const [short, more] = $derived.by(() => {
    if (!current) return [null, 0] as const;
    const foundIndex = items.indexOf(current);
    const short = items.slice(foundIndex, foundIndex + OVERFLOW_AMOUNT);
    return [short, items.length - foundIndex - OVERFLOW_AMOUNT];
  });
</script>

{#snippet entry(item: QueueItem<T>, current = false)}
  <div class="item" class:current>
    {#if item.type === "break"}
      <HourglassIcon size="16" />
    {:else}
      <div class="dot"></div>
    {/if}
  </div>
{/snippet}

<div class="wrapper">
  {#each short as item}
    {@render entry(item, item === current)}
  {/each}
  {#if more > 0}
    <p class="more">{more}+</p>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    gap: var(--gutter);
    align-items: center;
  }

  .item {
    opacity: 0.5;

    :global(svg) {
      display: block;
    }

    &.current {
      opacity: 1;
    }
  }

  .dot {
    width: 0.6em;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: currentColor;
  }

  .more {
    font-size: 0.8em;
    alignment-baseline: middle;
    color: var(--color-background);
    background: color-mix(in srgb, var(--color-text) 50%, transparent);
    padding: 4px;
    border-radius: 4px;
  }
</style>
