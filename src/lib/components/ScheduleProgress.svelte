<script lang="ts">
  import type { QueueItem, ScheduleQueue } from "$lib/utils/queue.svelte";
  import { HourglassIcon } from "@lucide/svelte";
  import Tooltip from "./Tooltip.svelte";
  import formatTime from "$lib/utils/formatTime";

  type Props = {
    queue: ScheduleQueue;
  };
  const { queue }: Props = $props();
  const items = $derived(queue.queue);
  const currentIndex = $derived(queue.currentIndex);
  const currentCount = $derived(
    currentIndex !== null ? currentIndex + 1 : null,
  );
  const length = $derived(items.length);

  type RenderItem = {
    current: boolean;
    kind: QueueItem["type"];
    duration: number;
    amount: number;
  };
  const blocks = $derived.by(() => {
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
</script>

<div class="wrapper">
  {#if blocks}
    <div class="items">
      {#each blocks as { kind, current, duration, amount }}
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
    <div class="item">
      <div class="schedule">
        {currentCount} / {length}
      </div>
    </div>
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
</style>
