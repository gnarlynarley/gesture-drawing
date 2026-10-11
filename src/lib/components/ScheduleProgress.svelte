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

  type RenderItem = {
    current: boolean;
    kind: QueueItem["type"];
    duration: number;
    amount: number;
  };
  const [blocks, hasMore] = $derived.by(() => {
    if (currentIndex === null) return [null, false] as const;

    const sliced = items.slice(currentIndex);
    const blocks = sliced.reduce<RenderItem[]>((acc, item, index, arr) => {
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
    const slicedBlocks = blocks.slice(0, 3);

    return [slicedBlocks, slicedBlocks.length !== blocks.length] as const;
  });
</script>

<div class="wrapper">
  {#if blocks}
    <div class="items">
      {#each blocks as { kind, current, duration, amount }}
        <div class="item" class:current>
          {#if kind === "break"}
            <Tooltip text={`Break of ${duration}`}>
              <HourglassIcon size="16" absoluteStrokeWidth />
            </Tooltip>
          {:else}
            <div class="schedule">
              {formatTime(duration)}
              <span class="amount">{amount}</span>
            </div>
          {/if}
        </div>
      {/each}
      {#if hasMore}
        <p>...</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    gap: var(--gutter);
  }

  .items {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    white-space: nowrap;
  }

  .item {
    --color: white;
    color: var(--color);

    :global(svg) {
      display: block;
    }

    &:not(.current) {
      --color: color-mix(
        in srgb,
        var(--color-background) 60%,
        var(--color-text)
      );
    }
  }

  .schedule {
    alignment-baseline: middle;
    color: var(--color-background);
    background: var(--color);
    border-radius: 4px;
    padding: 4px;
    display: flex;

    .amount {
      border-left: currentColor 1px solid;
      padding-left: calc(var(--gutter) * 0.5);
      margin-left: calc(var(--gutter) * 0.5);
    }

    .current & {
      /* background-color: var(--color-text); */
    }
  }
</style>
