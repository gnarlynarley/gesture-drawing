<script lang="ts">
  import Box from "$lib/components/Box.svelte";
  import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import CreditBox from "$lib/components/CreditBox.svelte";
  import DragList from "$lib/components/DragList.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import TimeInput from "$lib/components/TimeInput.svelte";
  import { chooseDirectory } from "$lib/stores/directory.svelte";
  import { resetSettings, settings, themes } from "$lib/stores/setting.svelte";
  import createId from "$lib/utils/createId";
  import type { Schedule } from "$lib/utils/schedule";
  import { blur } from "svelte/transition";
  import { CoffeeIcon, ImageIcon } from "@lucide/svelte";

  type Props = {
    files: unknown[] | null;
    startPractice: () => void;
  };

  let { startPractice, files }: Props = $props();

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

  const canStart = $derived(
    files &&
      files.length > 0 &&
      $settings.schedules.some((s) => s.type === "picture"),
  );
</script>

<div class="wrapper">
  <Box xl>
    <h1>Setup</h1>

    <div class="stack">
      <Box xl>
        <Button onclick={chooseDirectory}>
          {#if canStart}
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
          description="Time in seconds between every picture so you can adjust the canvas or etc."
          bind:value={$settings.intermissionTime}
          disabled={!$settings.autoPlay}
        />

        <!-- <Checkbox
            label="With sounds"
            name="sound"
            bind:checked={$settings.sound}
          /> -->

        <hr />

        <Select label="Theme" bind:value={$settings.theme} items={themes} />
        <Button onclick={resetSettings}>Reset</Button>
      </Box>

      <Box>
        <h2>Schedules</h2>
        {#if $settings.schedules.length > 0}
          <div class="items" transition:blur>
            <div class="item item--header">
              <span>Type</span>
              <span>Amount</span>
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
                  {#if $settings.schedules[index].type === "break"}
                    <center>Break</center>
                  {:else}
                    <Input
                      name="amount"
                      bind:value={($settings.schedules[index] as any).amount}
                    />
                  {/if}
                  <TimeInput bind:value={$settings.schedules[index].duration} />
                  <Button onclick={() => deleteSchedule(schedule)}
                    >&times</Button
                  >
                </div>
              {/snippet}
            </DragList>
          </div>
        {/if}
        <div class="buttons">
          <Button onclick={addSchedule}>Add schedule</Button>
          <Button onclick={addBreak}>Add break</Button>
        </div>
      </Box>
    </div>

    <Button primary onclick={startPractice} disabled={!canStart}>Start</Button>
    <div class="footer">
      <CreditBox />
    </div>
  </Box>
</div>

<style lang="scss">
  .wrapper {
    margin-top: calc(var(--spacing) * 3);
    flex-direction: column;
    width: 100%;
    padding: var(--gutter);
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
    grid-template-columns: 1fr auto auto;

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

  .footer {
    margin-inline: calc(var(--gutter) * -1);
    margin-bottom: calc(var(--gutter) * -1);
    background: var(--color-accent);
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--gutter);
  }
</style>
