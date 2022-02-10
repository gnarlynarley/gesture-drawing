<script lang="ts">
  import { writable } from "svelte/store";
  import { getFilesFromDropEvent } from "../../../lib/utils/drop";
  import Splash from "./Splash.svelte";

  type SplashType = { x: number; y: number };

  export let onChange: (value: File[]) => void;
  export let isValidValue: (value: FileSystemFileEntry) => boolean;

  let container: HTMLElement;
  let input: HTMLInputElement;

  const splashDuration = 300;
  const splashes = writable<SplashType[]>([]);

  let active = false;

  async function handleDrop(ev: DragEvent) {
    ev.preventDefault();
    const rect = container.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const splash = { x, y };
    splashes.update((prev) => prev.concat(splash));
    active = false;
    const newFiles = await getFilesFromDropEvent(ev, isValidValue);
    onChange(newFiles);
  }

  function handleRemoveSplash(splash: SplashType) {
    splashes.update((prev) => prev.filter((item) => item !== splash));
  }

  function handleDragOver(ev: DragEvent) {
    ev.preventDefault();
  }
  function handleDragEnter(ev: DragEvent) {
    active = true;
  }
  function handleDragLeave(ev: DragEvent) {
    active = false;
  }

  function handleOnChange() {
    const files = Array.from(input.files ?? []);
    onChange(files);
    input.value = "";
  }
</script>

<div
  bind:this={container}
  class="zone"
  class:active
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
>
  <slot />
  {#each $splashes as splash (splash)}
    <Splash
      duration={splashDuration}
      x={splash.x}
      y={splash.y}
      onDone={() => handleRemoveSplash(splash)}
    />
  {/each}
</div>

<style lang="scss">
  .zone {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    border: var(--border-width) solid var(--color-accent-300);
    background-color: var(--color-accent-100);
    border-radius: var(--border-radius);
    transition: 150ms ease-in-out;
    transition-property: border-color, background-color, box-shadow;

    &.active {
      border-color: var(--color-primary);
      background-color: var(--color-primary-100);
      box-shadow: 0 0.1em 3em rgba(black, 0.2);
    }
  }
</style>
