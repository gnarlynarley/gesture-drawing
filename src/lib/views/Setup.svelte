<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import Input from "$lib/components/Input.svelte";
  import TimeInput from "$lib/components/TimeInput.svelte";
  import { chooseDirectory } from "$lib/stores/directory.svelte";
  import { settings } from "$lib/stores/setting.svelte";
  import type { Schedule } from "$lib/utils/schedule";
  import { blur, fade } from "svelte/transition";

  type Props = {
    startPractice: null | (() => void);
  };

  let { startPractice }: Props = $props();

  function addSchedule() {
    $settings.schedules.push({
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
</script>

<div class="wrapper">
  <h1>Setup</h1>
  <Button onclick={chooseDirectory}>
    {#if $settings.directory}
      Choose different folder
    {:else}
      Choose folder
    {/if}
  </Button>

  <Input
    label="Intermission time"
    name="intermissiontime"
    bind:value={$settings.intermissionTime}
  />
  <Checkbox
    label="Autoplay"
    name="autoplay"
    bind:checked={$settings.autoPlay}
  />

  <div class="box">
    <div class="items">
      <div class="item">
        <span>Amount</span>
        <span>Duration</span>
      </div>
      {#each $settings.schedules as schedule}
        <div class="item" transition:fade>
          <Input name="amount" bind:value={schedule.amount} />
          <TimeInput bind:value={schedule.duration} />
          <Button tabindex={-1} onclick={() => deleteSchedule(schedule)}>
            &times
          </Button>
        </div>
      {/each}
    </div>
    <Button onclick={addSchedule}>Add schedule</Button>
  </div>

  <Button
    primary
    onclick={startPractice ?? undefined}
    disabled={!startPractice}
  >
    Start
  </Button>
</div>

<style lang="scss">
  .wrapper {
    padding: var(--gutter);
    border-radius: var(--border-radius);
    border: 2px solid var(--color-accent);
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
    padding: var(--gutter);
    max-width: 30em;
    width: 100%;
    background-color: var(--color-background);
  }

  .box {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--color-accent);
    padding: var(--gutter);
    border-radius: var(--border-radius);
    gap: var(--spacing);
  }

  .items {
    gap: var(--gutter);
    display: grid;
    grid-template-columns: 1fr 1fr auto;

    .item {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      justify-items: end;

      label {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
    }
  }
</style>
