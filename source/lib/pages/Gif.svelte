<script lang="ts">
  import DropZone from "../components/atoms/DropZone.svelte";
  import { extractGif } from "../utils/extractGifFrames";
  import createImage from "../utils/image/createImage";
  import imageDataToUrl from "../utils/image/imageDataToBlob";

  let file: File | null = null;

  function addFiles(newFiles: File[]) {
    file = newFiles[0] ?? null;
  }

  async function getFrames(nextFile: File | null) {
    if (nextFile === null) return null;
    const url = URL.createObjectURL(nextFile);
    const image = await createImage(url);
    const { frames } = await extractGif(image);
    const urls = await Promise.all(
      frames.map((frame) => imageDataToUrl(frame.data))
    );

    return urls;
  }

  $: urlsPromise = getFrames(file);
</script>

<div class="container">
  <div class="dropzone">
    <DropZone
      isValidValue={(entry) => /\.(gif)$/.test(entry.name)}
      onChange={addFiles}
    />
  </div>
  <div class="frames">
    {#if file !== null}
      {#await urlsPromise}
        <h1>extracting..</h1>
      {:then urls}
        {#if urls !== null}
          {#each urls as url}
            <img src={url} alt="" />
          {/each}
        {/if}
      {/await}
    {:else}
      <h3>no file loaded</h3>
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template:
      "frames" 1fr
      "dropzone" auto;
    padding: var(--spacing);
  }

  .dropzone {
    grid-area: dropzone;
  }

  .frames {
    grid-area: frames;
    overflow: auto;
  }
</style>
