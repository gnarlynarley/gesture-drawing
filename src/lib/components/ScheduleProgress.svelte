<script lang="ts" generics="T">
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import { HourglassIcon } from "@lucide/svelte";
  import Tooltip from "./Tooltip.svelte";
  import parseTime from "$lib/utils/parseTime";

  const OVERFLOW_AMOUNT = 5;

  type Props = {
    previous: QueueItem<T>[];
    next: QueueItem<T>[];
    current: QueueItem<T> | null;
  };
  const { previous, next, current }: Props = $props();
  const items = $derived(previous.concat(next));
  const currentIndex = $derived(current ? items.indexOf(current) : null);
  const currentCount = $derived(
    currentIndex !== null ? currentIndex + 1 : null,
  );
  const length = $derived(items.length);
  const short = $derived.by(() => {
    if (currentIndex === null) return null;
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(length, start + OVERFLOW_AMOUNT);
    return items.slice(Math.max(0, Math.min(end - OVERFLOW_AMOUNT)), end);
  });
</script>

{#snippet entry(item: QueueItem<T>, current = false)}
  {@const duration = parseTime(item.duration)}
  <div class="item" class:current>
    {#if item.type === "break"}
      <Tooltip text={`Break of ${duration}`}>
        <HourglassIcon size="16" />
      </Tooltip>
    {:else}
      <Tooltip text={`Break of ${duration}`}>
        <div class="dot"></div>
      </Tooltip>
    {/if}
  </div>
{/snippet}

<div class="wrapper">
  {#each short as item}
    {@render entry(item, item === current)}
  {/each}
  {#if currentCount !== null}
    <p class="more">{currentCount} / {length}</p>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    gap: var(--gutter);
    align-items: center;
  }

  .item {
    :global(svg) {
      display: block;
    }

    &:not(.current) {
      color: color-mix(in srgb, var(--color-text) 30%, var(--color-background));
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
