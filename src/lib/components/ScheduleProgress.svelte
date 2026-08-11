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
    const start = Math.max(0, currentIndex);
    const end = Math.min(length, start + OVERFLOW_AMOUNT);
    return items.slice(Math.max(0, Math.min(end - OVERFLOW_AMOUNT)), end);
  });
</script>

{#snippet entry(
  item: QueueItem<T>,
  items: QueueItem<T>[],
  index: number,
  current = false,
)}
  {@const duration = parseTime(item.duration)}
  <div class="item" class:current>
    {#if item.type === "break"}
      <Tooltip text={`Break of ${duration}`}>
        <HourglassIcon size="16" />
      </Tooltip>
    {:else}
      {@const prev = items[index - 1]}
      {@const isSame = prev
        ? prev.type === item.type && prev.duration === item.duration
        : false}
      <div class="schedule" class:isSame>
        {duration}
      </div>
    {/if}
  </div>
{/snippet}

<div class="wrapper">
  {#if short}
    <div class="items">
      {#each short as item, index}
        {@render entry(item, short, index, item === current)}
      {/each}
    </div>
  {/if}
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

  .items {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .item {
    :global(svg) {
      display: block;
    }

    &:not(.current) {
      color: color-mix(in srgb, var(--color-text) 30%, var(--color-background));
    }
  }

  .schedule {
    font-size: 0.8em;
    alignment-baseline: middle;
    color: var(--color-background);
    background: color-mix(in srgb, var(--color-text) 50%, transparent);
    border-radius: 4px;
    padding: 4px;

    &.isSame {
      width: 2ch;
      overflow: hidden;
      margin-left: -6px;
      color: transparent;
    }

    .current & {
      background-color: var(--color-text);
    }
  }

  .more {
    alignment-baseline: middle;
    padding: 4px;
    border-radius: 4px;
  }
</style>
