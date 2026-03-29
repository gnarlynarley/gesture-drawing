<script lang="ts">
  import Setup from "$lib/views/Setup.svelte";
  import { files } from "$lib/stores/directory.svelte";
  import GesturePractice from "$lib/views/GesturePractice.svelte";
  import { pendingSettings, settings } from "$lib/stores/setting.svelte";
  import NotificationManager from "$lib/components/NotificationManager.svelte";
  import Button from "$lib/components/Button.svelte";
  import { needRefresh, offlineReady, updateServiceWorker } from "$lib/pwa";

  let start = $state(false);

  function startPractice() {
    start = true;
  }

  function stopPractice() {
    start = false;
  }

  function closeUpdateBar() {
    offlineReady.set(false);
    needRefresh.set(false);
  }

  const showUpdateBar = $derived($offlineReady || $needRefresh);
</script>

<div class="wrapper">
  {#if showUpdateBar}
    <div class="update-bar" role="alert">
      <p>A new update is available</p>

      {#if $needRefresh}
        <button onclick={() => updateServiceWorker(true)}>Update</button>
      {/if}

      <div class="close">
        <Button onclick={closeUpdateBar}>&times;</Button>
      </div>
    </div>
  {/if}
  {#await pendingSettings then _}
    {#if $files && start}
      <GesturePractice
        {stopPractice}
        files={$files}
        schedules={$settings.schedules}
        intermissionTime={$settings.intermissionTime}
        autoPlay={$settings.autoPlay}
        sound={$settings.sound}
      />
    {:else}
      <Setup {startPractice} files={$files} />
    {/if}
  {/await}
</div>

<NotificationManager />

<style>
  .wrapper {
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .update-bar {
    display: flex;
    align-items: center;
    padding: var(--gutter);
    gap: var(--gutter);
    background-color: var(--color-background);
    border-bottom: 2px solid var(--color-accent);

    .close {
      margin-left: auto;
    }
  }
</style>
