<script lang="ts">
  import Box from "$lib/components/Box.svelte";
  import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import DragList from "$lib/components/DragList.svelte";
  import Input from "$lib/components/Input.svelte";
  import TimeInput from "$lib/components/TimeInput.svelte";
  import { chooseDirectory } from "$lib/stores/directory.svelte";
  import { settings } from "$lib/stores/setting.svelte";
  import createId from "$lib/utils/createId";
  import type { Schedule } from "$lib/utils/schedule";
  import { blur } from "svelte/transition";

  type Props = {
    files: unknown[] | null;
    startPractice: () => void;
  };

  let { startPractice, files }: Props = $props();

  function addSchedule() {
    $settings.schedules.push({
      id: createId(),
      amount: 0,
      duration: 0,
    });
    $settings.schedules = $settings.schedules;
  }

  function deleteSchedule(schedule: Schedule) {
    const foundIndex = $settings.schedules.indexOf(schedule);
    if (foundIndex !== -1) {
      $settings.schedules.splice(foundIndex, 1);
      $settings.schedules = $settings.schedules;
    }
  }

  const canStart = $derived(
    files && files.length > 0 && $settings.schedules.length > 0,
  );
</script>

<div class="wrapper">
  <Box xl>
    <h1>Setup</h1>

    <div class="options">
      <Box xl>
        <Button onclick={chooseDirectory}>
          {#if canStart}
            Choose different folder
          {:else}
            Choose folder
          {/if}
        </Button>

        <Input
          label="Intermission time"
          name="intermissiontime"
          description="Time in seconds between every picture so you can adjust the canvas or etc."
          bind:value={$settings.intermissionTime}
        />

        <Checkbox
          label="Autoplay"
          name="autoplay"
          description="Automatically advance to the next picture"
          bind:checked={$settings.autoPlay}
        />

        <!-- <Checkbox
          label="With sounds"
          name="sound"
          bind:checked={$settings.sound}
        /> -->
      </Box>

      <Box>
        {#if $settings.schedules.length > 0}
          <div class="items" transition:blur>
            <div class="item">
              <span>Amount of pictures</span>
              <span>Time</span>
            </div>
            <DragList bind:items={$settings.schedules}>
              {#snippet content(schedule, index, { before, after, dragging })}
                <div
                  class="item"
                  class:before
                  class:after
                  class:dragging
                  transition:blur
                >
                  <Input
                    name="amount"
                    bind:value={$settings.schedules[index].amount}
                  />
                  <TimeInput bind:value={$settings.schedules[index].duration} />
                  <Button onclick={() => deleteSchedule(schedule)}
                    >&times</Button
                  >
                </div>
              {/snippet}
            </DragList>
          </div>
        {/if}
        <Button onclick={addSchedule}>Add schedule</Button>
      </Box>
    </div>

    <Button primary onclick={startPractice} disabled={!canStart}>Start</Button>
  </Box>
</div>

<style lang="scss">
  .wrapper {
    margin: auto;
    flex-direction: column;
    width: 100%;
    padding: var(--gutter);
    max-width: 80em;
    container-type: inline-size;
  }

  .options {
    display: grid;
    gap: 1em;

    @container (width > 1000px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .items {
    gap: var(--gutter);
    display: grid;
    grid-template-columns: 1fr auto auto;

    .item {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      gap: var(--gutter);
      align-items: flex-end;

      &.dragging {
        opacity: 0.5;
      }
      &.before {
        border-color: var(--color-secondary);
        background-image: linear-gradient(
          to bottom,
          color-mix(in srgb, var(--color-secondary), transparent 70%),
          transparent
        );
      }
      &.after {
        border-color: var(--color-secondary);
        background-image: linear-gradient(
          to top,
          color-mix(in srgb, var(--color-secondary), transparent 70%),
          transparent
        );
      }
    }
  }
</style>
