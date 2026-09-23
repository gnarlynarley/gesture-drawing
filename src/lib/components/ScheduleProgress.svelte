<script lang="ts" generics="T">
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import { HourglassIcon } from "@lucide/svelte";
  import Tooltip from "./Tooltip.svelte";
  import formatTime from "$lib/utils/formatTime";

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
    return items.slice(start);
  });

  type RenderItem = {
    current: boolean;
    kind: QueueItem["type"];
    duration: number;
    amount: number;
  };
  const f = $derived.by(() => {
    if (currentIndex === null) return null;
    const sliced = items.slice(currentIndex);
    return sliced.reduce<RenderItem[]>((acc, item, index, arr) => {
      const prev = arr[index - 1];
      if (prev && prev.duration === item.duration && prev.type === item.type) {
        const prevRenderItem = acc[acc.length - 1];
        if (prevRenderItem) {
          prevRenderItem.amount += 1;
        }
      } else {
        acc.push({
          current: index === 0,
          kind: item.type,
          duration: item.duration,
          amount: 1,
        });
      }
      return acc;
    }, []);
  });
  $inspect(f);
</script>

<div class="wrapper">
  {#if f}
    <div class="items">
      {#each f as { kind, current, duration, amount }}
        <div class="item" class:current>
          {#if kind === "break"}
            <Tooltip text={`Break of ${duration}`}>
              <HourglassIcon size="16" />
            </Tooltip>
          {:else}
            <div class="schedule">
              {formatTime(duration)}
              <span class="amount">{amount}</span>
            </div>
          {/if}
        </div>
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
    align-items: center;
  }

  .items {
    --overflow-width: var(--gutter);
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 600px;
    overflow: hidden;
    padding-right: var(--overflow-width);
    mask-image: linear-gradient(
      to left,
      transparent,
      black var(--overflow-width)
    );
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
    display: flex;

    .amount {
      border-left: currentColor 1px solid;
      padding-left: calc(var(--gutter) * 0.5);
      margin-left: calc(var(--gutter) * 0.5);
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
