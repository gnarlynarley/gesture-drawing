<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import {
    ArrowBigRightIcon,
    ArrowBigRightDashIcon,
    LogOutIcon,
    PauseIcon,
    PlayIcon,
    RefreshCcwIcon,
    FlipHorizontal2Icon,
    PaletteIcon,
  } from "@lucide/svelte";
  import { type Schedule } from "$lib/utils/schedule";
  import Timebar from "$lib/components/Timebar.svelte";
  import createQueue from "$lib/utils/createQueue.svelte";
  import parseTime from "$lib/utils/parseTime";
  import type { ImageFileHandle } from "$lib/models";
  import Charr from "$lib/components/Charr.svelte";
  import FileHandleImageGrid from "$lib/components/FileHandleImageGrid.svelte";
  import FileImage from "$lib/components/FileImage.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import beep from "$lib/utils/beep";
  import createImage from "$lib/utils/createImage";
  import PageLayout from "$lib/components/PageLayout.svelte";

  type Props = {
    files: ImageFileHandle[];
    stopPractice: () => void;
    schedules: Schedule[];
    intermissionTime: number;
    autoPlay: boolean;
    sound: boolean;
  };

  const {
    files,
    stopPractice,
    schedules,
    intermissionTime,
    autoPlay,
    sound,
  }: Props = $props();

  const queue = $derived(createQueue(files, schedules));
  let currentFile = $state<File | null>(null);
  let totalTime = $state(0);
  let time = $state(0);
  const currentTime = $derived(totalTime - time);

  type ViewState = "drawing" | "intermission" | "pending" | "end";

  let view = $state<ViewState>("drawing");
  let playing = $state(true);

  async function loadImage(file: File | null) {
    try {
      if (file === null) {
        currentFile = null;
      } else {
        const src = URL.createObjectURL(file);
        await createImage(src);
        URL.revokeObjectURL(src);
        currentFile = file;
      }
    } catch {
      currentFile = null;
    }
  }

  function playsound() {
    if (sound) {
      beep();
    }
  }

  async function next(skipIntermission = false) {
    if (view === "pending") return;
    const isIntermission = !(
      !autoPlay ||
      skipIntermission ||
      view === "intermission" ||
      intermissionTime === 0
    );

    // if intermission, set the practice. Else set the intermission state
    if (isIntermission) {
      const next = queue.getNext();
      if (next !== null) {
        view = "intermission";
        totalTime = intermissionTime * 1000;
        time = intermissionTime * 1000;
      } else {
        playing = false;
        view = "end";
      }
      return;
    }

    queue.next();

    if (queue.state.reachedEnd || !queue.state.current) {
      playing = false;
      view = "end";
      return;
    }

    view = "pending";
    await loadImage(await queue.state.current.item.getFile());
    totalTime = queue.state.current.schedule.duration * 1000;
    time = queue.state.current.schedule.duration * 1000;
    view = "drawing";
  }

  async function skip() {
    if (!queue.state.current) return;
    queue.skip();
    view = "pending";
    await loadImage(await queue.state.current.item.getFile());
    view = "drawing";
    time = queue.state.current.schedule.duration * 1000;
  }

  function reset() {
    queue.reset();
    playing = true;
    next();
  }

  next(true);

  function togglePlay() {
    playing = !playing;
  }

  $effect(() => {
    if (!playing) return;
    if (!(view === "intermission" || view === "drawing")) return;
    let lastTime = performance.now();
    const intervalId = setInterval(() => {
      const currentTime = performance.now();
      const ellapsed = currentTime - lastTime;
      lastTime = currentTime;
      time -= ellapsed;

      if (time <= 0) {
        if (autoPlay) {
          next();
        }
        playsound();
      }
    }, 10);

    return () => {
      clearTimeout(intervalId);
    };
  });

  let flipped = $state(false);
  let grayscale = $state(false);

  function toggleFlip() {
    flipped = !flipped;
  }

  function toggleGrayscale() {
    grayscale = !grayscale;
  }

  function onkeydown(ev: KeyboardEvent) {
    switch (ev.key.toLowerCase()) {
      case " ": {
        togglePlay();
      }
      case "arrowright": {
        next();
      }
    }
  }
</script>

<svelte:window {onkeydown} />

<div
  class="wrapper"
  class:playing
  class:flipped
  class:grayscale
  class:exceeded-time={currentTime > totalTime}
>
  <PageLayout scroll={view === "end"}>
    {#snippet toolbar()}
      <div class="toolbar">
        {#if view === "end"}
          <Button onclick={reset}>
            <RefreshCcwIcon />
          </Button>
        {/if}
        {#if view === "drawing" || view === "pending"}
          <Button onclick={togglePlay} tooltip={playing ? "Pause" : "Play"}>
            {#if playing}
              <PauseIcon width="3" />
            {:else}
              <PlayIcon />
            {/if}
          </Button>

          <Button onclick={() => next(true)} tooltip="Next">
            <ArrowBigRightIcon />
          </Button>

          <Button onclick={skip} tooltip="Skip">
            <ArrowBigRightDashIcon />
          </Button>

          <div class="divider"></div>

          <Button
            onclick={toggleFlip}
            primary={flipped}
            bordered
            tooltip="Toggle flip"
          >
            <FlipHorizontal2Icon />
          </Button>

          <Button
            onclick={toggleGrayscale}
            primary={grayscale}
            bordered
            tooltip="Toggle grayscale"
          >
            <PaletteIcon />
          </Button>
          {#if queue.state.current}
            <div class="text">
              <span class="highlighted">{parseTime(currentTime / 1000)} </span>
              <span>/</span>
              <span>{parseTime(queue.state.current.schedule.duration)}</span>
            </div>
            <div class="text">
              {queue.state.current.page}/{queue.state.current.schedule.amount}
            </div>
          {/if}
        {/if}

        <div class="push"></div>
        <Button onclick={stopPractice} title="Exit" tooltip="Exit to setup">
          <LogOutIcon />
        </Button>
      </div>
    {/snippet}

    <div class="content">
      {#if view === "intermission"}
        <Charr />
        <h1>Intermission</h1>
      {:else if view === "pending"}
        <Spinner />
      {:else if view === "end"}
        <h1>Reached the end</h1>
        <FileHandleImageGrid entries={queue.state.history} />
      {:else if view === "drawing" && currentFile}
        <div class="image">
          <FileImage cover file={currentFile} />
        </div>
      {/if}
    </div>

    <Timebar {totalTime} {currentTime} />
  </PageLayout>
</div>

<style lang="scss">
  .wrapper {
    display: contents;
  }

  .toolbar {
    display: contents;

    .text {
      flex-shrink: 0;

      .exceeded-time & .highlighted {
        color: var(--color-primary);
      }
    }

    .push {
      width: 100%;
    }

    .divider {
      width: 2px;
      height: 50%;
      background-color: var(--color-accent);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: var(--spacing);
    gap: var(--gutter);

    .wrapper:not(.scroll) & {
      align-items: center;
      justify-content: center;
    }

    .image {
      position: relative;
      width: 100%;
      height: 100%;

      .wrapper.flipped & {
        scale: -1 1;
      }
      .wrapper.grayscale & {
        filter: saturate(0%);
      }
    }
  }
</style>
