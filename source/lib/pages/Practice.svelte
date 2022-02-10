<script lang="ts">
  import { onDestroy } from "svelte";
  import { settings } from "~lib/stores/settings";
  import { references } from "~lib/stores/references";
  import getRandomFromArray from "~lib/utils/getRandomFromArray";
  import addKeybind from "~lib/utils/svelte/addKeybind";
  import toggleFullScreen from "~lib/utils/toggleFullScreen";
  import Button from "~lib/components/atoms/Button.svelte";
  import IconClose from "~lib/components/atoms/IconClose.svelte";
  import IconFullScreen from "~lib/components/atoms/IconFullScreen.svelte";
  import IconPause from "~lib/components/atoms/IconPause.svelte";
  import IconPlay from "~lib/components/atoms/IconPlay.svelte";
  import IconReload from "~lib/components/atoms/IconReload.svelte";
  import IconSkipNext from "~lib/components/atoms/IconSkipNext.svelte";
  import IconSkipPrevious from "~lib/components/atoms/IconSkipPrevious.svelte";
  import ProgressBar from "~lib/components/atoms/ProgressBar.svelte";
  import SettingsButtonsRow from "~lib/components/molecules/SettingsButtonsRow.svelte";
  import { navigatePage } from "~lib/utils/navigation";
  import createBlobUrl from "~lib/utils/svelte/createBlobUrl";
  import Flex from "~lib/components/atoms/Flex.svelte";
  import formatTime from "~lib/utils/formatTime";

  let state: "playing" | "paused" = "playing";
  let time = 0;
  let list = [...$references];
  let history: File[] = [];
  let currentFile: File | null = getRandomFile();
  let timeoutId: number | null = null;
  let imageLoading = true;

  function navigateHome() {
    navigatePage("home");
  }

  function cleanup() {
    if (timeoutId !== null) clearInterval(timeoutId);
  }

  function restartSession() {
    time = 0;
    state = "playing";
    list = [...$references];
    history = [];
    currentFile = getRandomFile();
    timeoutId = null;
  }

  function toggleState() {
    state = state === "playing" ? "paused" : "playing";
  }

  function getRandomFile() {
    const file = getRandomFromArray(list);
    if (file) {
      const index = list.indexOf(file);
      if (index !== -1) {
        list.splice(index, 1);
        list = list;
        history = history.concat(file);
      }
    }
    return file;
  }

  function previousFile() {
    const nextFileIndex = currentFile
      ? history.indexOf(currentFile)
      : history.length - 1;
    const foundFile =
      (nextFileIndex !== -1 ? history[nextFileIndex - 1] : null) ?? null;
    if (foundFile) {
      currentFile = foundFile;
    } else {
      currentFile = currentFile;
    }
  }

  function nextFile() {
    const nextFileIndex = currentFile ? history.indexOf(currentFile) : -1;
    if (nextFileIndex !== -1 || nextFileIndex !== history.length - 1) {
      currentFile = getRandomFile();
    } else {
      currentFile = history[nextFileIndex] ?? null;
    }
  }

  onDestroy(() => {
    cleanup();
  });

  function onStateChange(
    nextState: typeof state,
    nextImageLoaded: typeof imageLoading,
  ) {
    if (nextState === "playing" && nextImageLoaded === false) {
      const delta = 100;
      if (timeoutId !== null) clearInterval(timeoutId);
      timeoutId = window.setInterval(() => {
        time += delta;
        if (time > $settings.duration * 1000) {
          currentFile = getRandomFile();
        }
      }, delta);
    } else {
      cleanup();
    }
  }

  async function onFileChange(newFile: File | null) {
    time = 0;
    imageLoading = true;
    imageLoading = false;
  }

  $: onFileChange(currentFile);
  $: onStateChange(state, imageLoading);
  $: src = currentFile && createBlobUrl(currentFile);

  addKeybind("space", toggleState);
  addKeybind("f", toggleFullScreen);
  addKeybind("j", previousFile);
  addKeybind("left", previousFile);
  addKeybind("l", nextFile);
  addKeybind("right", nextFile);
</script>

<div class="container" class:is-paused={state === "paused"}>
  <div class="header">
    <Flex>
      <span class="duration">{formatTime(time)}</span>
      <SettingsButtonsRow />
    </Flex>
    <div>
      {#if state === "playing"}
        <Button icon onClick={toggleState} title="Pause">
          <IconPause />
        </Button>
      {:else}
        <Button icon onClick={toggleState} title="Play">
          <IconPlay />
        </Button>
      {/if}
      <Button icon onClick={previousFile} title="Go back">
        <IconSkipPrevious />
      </Button>
      <Button icon onClick={nextFile} title="Next">
        <IconSkipNext />
      </Button>
      <Button icon onClick={toggleFullScreen} title="Toggle fullscreen mode">
        <IconFullScreen />
      </Button>
      <Button icon onClick={restartSession} title="Restart">
        <IconReload />
      </Button>
      <Button icon onClick={navigateHome} title="Close">
        <IconClose />
      </Button>
    </div>
  </div>
  <div class="main">
    <div class="main__inner">
      {#if currentFile !== null}
        {#if $src !== null}
          <img
            class="image"
            class:is-grayscale={!$settings.color}
            class:is-horizontally-flipped={$settings.flippedHorizontal}
            class:is-vertically-flipped={$settings.flippedVertical}
            alt={currentFile.name || ""}
            src={$src}
          />
        {/if}
      {:else}
        <div class="end-container">
          <h3>Reached the end</h3>
          <div>
            <Button onClick={previousFile}>Go back</Button>
            <Button onClick={restartSession}>Restart</Button>
            <Button onClick={navigateHome}>Close</Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
  {#if $settings.duration !== Infinity}
    <div class="progress">
      <ProgressBar limit={$settings.duration * 1000} value={time} />
    </div>
  {/if}
</div>

<style lang="scss">
  .duration {
    display: inline-block;
    width: 6em;
    font-size: 0.8em;
  }
  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-background);
    display: grid;
    grid-template:
      "header" auto
      "main" 1fr
      "progress" auto;
    grid-gap: var(--spacing);
    padding: var(--spacing);
  }

  .end-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
      margin-bottom: var(--spacing);
    }
  }

  .main {
    grid-area: main;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &__inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .image {
    object-fit: contain;
    width: 100%;
    height: 100%;

    &.is-grayscale {
      filter: grayscale(1);
    }
    &.is-horizontally-flipped {
      transform: scale(-1, 1);
    }
    &.is-vertically-flipped {
      transform: scale(1, -1);
    }
    &.is-horizontally-flipped.is-vertically-flipped {
      transform: scale(-1, -1);
    }
  }

  .progress {
    grid-area: progress;
    width: 30em;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 3em;

    .container.is-paused & {
      opacity: 0.1;
    }
  }

  .header {
    grid-area: header;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all var(--animation-speed) ease-in-out;
    filter: drop-shadow(0 1px 3px rgba(black, 0.1));
  }
</style>
