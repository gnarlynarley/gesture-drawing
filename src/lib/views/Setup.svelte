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
  import { fade } from "svelte/transition";

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
  <Box>
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

    <Box>
      <div class="items">
        <DragList bind:items={$settings.schedules}>
          {#snippet content(schedule, index)}
            <div class="item" transition:fade>
              <Input
                name="amount"
                label="Amount"
                bind:value={$settings.schedules[index].amount}
              />
              <TimeInput
                label="Time"
                bind:value={$settings.schedules[index].duration}
              />
              <Button tabindex={-1} onclick={() => deleteSchedule(schedule)}>
                &times
              </Button>
            </div>
          {/snippet}
        </DragList>
      </div>
      <Button onclick={addSchedule}>Add schedule</Button>
    </Box>

    <Button primary onclick={startPractice} disabled={!canStart}>Start</Button>
  </Box>
</div>

<style lang="scss">
  .wrapper {
    margin: auto;
    flex-direction: column;
    max-width: 40em;
    width: 100%;
    padding: var(--gutter);
  }

  .items {
    gap: var(--gutter);

    .item {
      display: flex;
      gap: var(--gutter);
      align-items: flex-end;
    }
  }
</style>
