<script lang="ts">
  import Setup from "$lib/views/Setup.svelte";
  import { files } from "$lib/stores/directory.svelte";
  import GesturePractice from "$lib/views/GesturePractice.svelte";
  import { pendingSettings, settings } from "$lib/stores/setting.svelte";
  import NotificationManager from "$lib/components/NotificationManager.svelte";

  let start = $state(false);

  function startPractice() {
    start = true;
  }

  function stopPractice() {
    start = false;
  }
</script>

<div class="wrapper">
  {#await pendingSettings then _}
    {#if $files && start}
      <GesturePractice
        {stopPractice}
        files={$files}
        schedules={$settings.schedules}
        intermissionTime={$settings.intermissionTime}
        autoPlay={$settings.autoPlay}
      />
    {:else}
      <Setup {startPractice} files={$files} />
    {/if}
  {/await}
</div>

<NotificationManager />

<style>
  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
