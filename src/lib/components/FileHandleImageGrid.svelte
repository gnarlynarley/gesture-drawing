<script lang="ts">
  import { ImageFileHandle } from "$lib/models";
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import parseTime from "$lib/utils/parseTime";
  import type { Schedule } from "$lib/utils/schedule";
  import FileHandleImage from "./FileImage.svelte";

  type Props = {
    entries: QueueItem<ImageFileHandle>[];
  };

  const { entries }: Props = $props();
  let selectedFile = $state<File | null>(null);

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

  function onImageClick(file: File) {
    selectedFile = file;
  }

  function onImageClose() {
    selectedFile = null;
  }

  function onkeydown(ev: KeyboardEvent) {
    switch (ev.key) {
      case "Escape": {
        onImageClose();
        break;
      }
    }
  }
</script>

<svelte:window {onkeydown} />

<div class="wrapper">
  {#await groupedPromise then grouped}
    {#each grouped as item}
      <div class="item">
        <h2>Duration: {parseTime(item.schedule.duration)}</h2>
        <div class="grid">
          {#each item.files as file, index}
            <button
              class="image"
              type="button"
              onclick={() => onImageClick(file)}
            >
              <span class="label">
                Picture #{index + 1}
              </span>
              <FileHandleImage {file} />
            </button>
          {/each}
        </div>
      </div>
    {/each}
  {/await}
</div>
{#if selectedFile}
  <button type="button" class="fullscreen" onclick={onImageClose}>
    <div class="inner">
      <FileHandleImage fit cover file={selectedFile} />
    </div>
  </button>
{/if}

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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--gutter);
    align-content: stretch;
  }

  .image {
    display: flex;
    flex-direction: column;
    gap: var(--gutter);

    :global(image) {
      flex-grow: 1;
    }
  }

  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: color-mix(
      in oklab,
      var(--color-background),
      transparent 10%
    );
    display: flex;

    .inner {
      width: 100%;
      position: relative;
      margin: var(--spacing);
    }
  }
</style>
