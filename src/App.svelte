<script lang="ts">
  import Setup from "$lib/views/Setup.svelte";
  import { files } from "$lib/stores/directory.svelte";
  import GesturePractice from "$lib/views/GesturePractice.svelte";
  import { pendingSettings, settings } from "$lib/stores/setting.svelte";
  import NotificationManager from "$lib/components/NotificationManager.svelte";
  import Box from "$lib/components/Box.svelte";

  let start = $state(false);
  let startPractice = $derived(
    $files
      ? () => {
          start = true;
        }
      : null,
  );

  function stopPractice() {
    start = false;
  }

  const apiSupported = "showDirectoryPicker" in self;
</script>

<div class="wrapper">
  {#if apiSupported}
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
        <Setup {startPractice} />
      {/if}
    {/await}
  {:else}
    <Box>
      <h1>File System Access API is not supported in this browser.</h1>
      <p>Please use a compatible browser such as Chrome or Edge.</p>
    </Box>
  {/if}
</div>

<NotificationManager />

<style>
  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
