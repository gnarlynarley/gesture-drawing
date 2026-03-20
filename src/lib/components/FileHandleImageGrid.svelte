<script lang="ts">
  import type { ImageFileHandle } from "$lib/models";
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import parseTime from "$lib/utils/parseTime";
  import type { Schedule } from "$lib/utils/schedule";
  import FileHandleImage from "./FileImage.svelte";

  type Props = {
    entries: QueueItem<ImageFileHandle>[];
  };

  const { entries }: Props = $props();
  const groupedPromise = $derived(
    Promise.all(
      entries
        .reduce<{ schedule: Schedule; files: Promise<File>[] }[]>(
          (acc, entry) => {
            let prevItem = acc[acc.length - 1];
            if (
              !prevItem ||
              prevItem.schedule.duration !== entry.schedule.duration
            ) {
              prevItem = { schedule: entry.schedule, files: [] };
              acc.push(prevItem);
            }
            prevItem.files.push(entry.item.getFile());
            return acc;
          },
          [],
        )
        .map(async (entry) => {
          const files = await Promise.all(entry.files);

          return {
            ...entry,
            files,
          };
        }),
    ),
  );
</script>

<div class="wrapper">
  {#await groupedPromise then grouped}
    {#each grouped as item}
      <div class="item">
        <p>Duration: {parseTime(item.schedule.duration)}</p>
        <div class="grid">
          {#each item.files as file}
            <FileHandleImage {file} />
          {/each}
        </div>
      </div>
    {/each}
  {/await}
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
