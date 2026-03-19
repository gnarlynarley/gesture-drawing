<script lang="ts">
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import parseTime from "$lib/utils/parseTime";
  import type { Schedule } from "$lib/utils/schedule";
  import FileHandleImage from "./FileHandleImage.svelte";

  type Props = {
    entries: QueueItem<FileSystemFileHandle>[];
  };

  const { entries }: Props = $props();
  const grouped = $derived(
    entries.reduce<{ schedule: Schedule; handles: FileSystemFileHandle[] }[]>(
      (acc, entry) => {
        let prevItem = acc[acc.length - 1];
        if (
          !prevItem ||
          prevItem.schedule.duration !== entry.schedule.duration
        ) {
          prevItem = { schedule: entry.schedule, handles: [] };
          acc.push(prevItem);
        }
        prevItem.handles.push(entry.item);
        return acc;
      },
      [],
    ),
  );
</script>

<div class="wrapper">
  {#each grouped as item}
    <div class="item">
      <p>Duration: {parseTime(item.schedule.duration)}</p>
      <div class="grid">
        {#each item.handles as handle}
          <FileHandleImage {handle} />
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    gap: var(--spacing);
  }

  .item {
    display: grid;
    gap: var(--gutter);
    border: 2px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: var(--gutter);
    background-color: var(--color-background);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--gutter);
    align-content: stretch;
  }
</style>
