<script lang="ts">
  import { ImageFileHandle } from "$lib/models";
  import type { QueueItem } from "$lib/utils/createQueue.svelte";
  import parseTime from "$lib/utils/parseTime";
  import type { Schedule } from "$lib/utils/schedule";
  import FileHandleImage from "./FileImage.svelte";
  import FilePath from "./FilePath.svelte";

  type Props = {
    entries: QueueItem<ImageFileHandle>[];
  };

  type Item = {
    file: File;
    path: string;
  };

  const { entries }: Props = $props();
  let selectedFile = $state<Item | null>(null);

  const groupedPromise = $derived(
    Promise.all(
      entries
        .reduce<{ schedule: Schedule; files: Promise<Item>[] }[]>(
          (acc, entry) => {
            let prevItem = acc[acc.length - 1];
            if (!prevItem || prevItem.schedule.duration !== entry.duration) {
              prevItem = { schedule: entry, files: [] };
              acc.push(prevItem);
            }
            prevItem.files.push(
              new Promise<Item>(async (resolve) => {
                resolve({
                  file: await entry.item.getFile(),
                  path: entry.item.path,
                });
              }),
            );
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

  function onImageClick(file: Item) {
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
              <FileHandleImage file={file.file} />
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
      <FileHandleImage fit cover file={selectedFile.file} />
    </div>
    <div class="path">
      <FilePath path={selectedFile.path} />
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
    width: 100dvw;
    height: 100dvh;
    background-color: color-mix(
      in oklab,
      var(--color-background),
      transparent 10%
    );
    display: grid;
    grid-template-rows: 1fr auto;
    gap: var(--gutter);

    .inner {
      position: relative;
      width: 100dvw;
    }

    .path {
      margin-inline: auto;
      padding: var(--gutter);
      background: var(--color-background);
      width: 100%;
      display: grid;
      justify-content: center;
    }
  }
</style>
