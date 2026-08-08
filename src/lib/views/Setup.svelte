<script lang="ts">
  import Box from "$lib/components/Box.svelte";
  import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import CreditBox from "$lib/components/CreditBox.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import TimeInput from "$lib/components/TimeInput.svelte";
  import { chooseDirectory } from "$lib/stores/directory.svelte";
  import { resetSettings, settings, themes } from "$lib/stores/setting.svelte";
  import createId from "$lib/utils/createId";
  import type { Schedule } from "$lib/utils/schedule";
  import ExplanationBox from "$lib/components/ExplanationBox.svelte";
  import moveArrayItem from "$lib/utils/moveArrayItem";
  import { ArrowUpIcon, ArrowDownIcon } from "@lucide/svelte";
  import { flip } from "svelte/animate";

  type Props = {
    files: unknown[] | null;
    startPractice: () => void;
  };

  type ValidationError = {
    amount: string | null;
    duration: string | null;
  };

  let { startPractice, files }: Props = $props();
  const scheduleValidationMap = $derived.by(() => {
    return $settings.schedules.map((schedule): ValidationError | null => {
      let amount: string | null = null;
      let duration: string | null = null;

      if (schedule.type === "break") return null;
      if (schedule.amount === 0)
        amount = "Schedule needs to have an amount greater than 0.";
      if (schedule.duration <= 0)
        duration = "Schedule needs to have an duration.";

      if (amount || duration) {
        return { amount, duration };
      }
      return null;
    });
  });
  const hasValidationError = $derived(
    scheduleValidationMap.some((value) => value !== null),
  );

  function addSchedule() {
    $settings.schedules.push({
      type: "picture",
      id: createId(),
      amount: 0,
      duration: 0,
    });
    $settings.schedules = $settings.schedules;
  }

  function addBreak() {
    $settings.schedules.push({
      type: "break",
      id: createId(),
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

  function moveSchedule(index: number, offset: 1 | -1) {
    let nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex > $settings.schedules.length - 1) return;
    $settings.schedules = moveArrayItem($settings.schedules, index, nextIndex);
  }

  const hasFiles = $derived(!!(files && files.length > 0));
  const canStart = $derived.by(
    () =>
      hasFiles &&
      $settings.schedules.some((s) => s.type === "picture") &&
      !hasValidationError,
  );
</script>

<div class="wrapper">
  <h1>Setup</h1>

  <div class="stack">
    <Box xl>
      <Button onclick={chooseDirectory} primary={!hasFiles}>
        {#if hasFiles}
          Choose different folder
        {:else}
          Choose folder
        {/if}
      </Button>

      <hr />

      <Checkbox
        label="Autoplay"
        name="autoplay"
        description="Automatically advance to the next picture"
        bind:checked={$settings.autoPlay}
      />

      <Input
        label="Intermission time"
        name="intermissiontime"
        description="Time in seconds between every picture so you can adjust the canvas or etc. (0 is none)"
        bind:value={$settings.intermissionTime}
        disabled={!$settings.autoPlay}
      />

      <hr />

      <Select label="Theme" bind:value={$settings.theme} items={themes} />

      <Button onclick={resetSettings}>Reset</Button>
    </Box>

    <Box>
      <h2>Schedules</h2>
      {#if $settings.schedules.length > 0}
        <div class="items">
          <div class="item item--header">
            <span>Amount</span>
            <span>Time</span>
          </div>
          {#each $settings.schedules as schedule, index (schedule.id)}
            {@const validation = scheduleValidationMap[index] ?? null}
            <div class="item" animate:flip={{ duration: 150 }}>
              {#if schedule.type === "break"}
                <center>Break</center>
              {:else}
                <Input
                  aria-label="Amount of images"
                  name="amount"
                  bind:value={schedule.amount}
                  error={validation?.amount}
                />
              {/if}
              <TimeInput
                bind:value={schedule.duration}
                error={validation?.duration}
              />
              <Button onclick={() => deleteSchedule(schedule)}>&times</Button>
              <div class="move-buttons">
                <button type="button" onclick={() => moveSchedule(index, -1)}>
                  <ArrowUpIcon size="14" absoluteStrokeWidth />
                </button>
                <button type="button" onclick={() => moveSchedule(index, 1)}>
                  <ArrowDownIcon size="14" absoluteStrokeWidth />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      <div class="buttons">
        <Button onclick={addSchedule}>Add schedule</Button>
        <Button onclick={addBreak}>Add break</Button>
      </div>
    </Box>
  </div>

  <Button primary onclick={startPractice} disabled={!canStart}>Start</Button>
</div>

<div class="footer">
  <CreditBox />
  <ExplanationBox />
</div>

<style lang="scss">
  .wrapper {
    margin-top: var(--spacing);
    flex-direction: column;
    width: 100%;
    padding: var(--gutter);
    gap: var(--gutter);
    display: grid;
    max-width: 80em;
    container-type: inline-size;
    margin-inline: auto;
  }

  .stack {
    display: grid;
    gap: var(--gutter);

    @container (width > 1000px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .items {
    gap: var(--gutter);
    display: grid;
    grid-template-columns: 1fr auto auto auto;

    .item {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      gap: var(--gutter);
      align-items: center;

      &.item--header {
        align-items: center;
        font-size: 0.85em;
        opacity: 0.6;
      }
    }

    .move-buttons {
      display: grid;
      grid-row: auto auto;
      align-items: center;
    }
  }

  .footer {
    margin-top: auto;
    padding: var(--gutter);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--gutter);
    margin-top: auto;
  }
</style>
