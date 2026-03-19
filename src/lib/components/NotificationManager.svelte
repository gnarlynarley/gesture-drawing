<script lang="ts">
  import { notifications } from "$lib/stores/notifications.svelte";
  import { blur } from "svelte/transition";
  import Notification from "./Notification.svelte";
</script>

<div class="wrapper">
  {#each notifications.value as notification (notification.id)}
    <div transition:blur>
      <Notification {notification} />
    </div>
  {/each}
</div>

<style>
  .wrapper {
    position: fixed;
    bottom: var(--gutter);
    right: var(--gutter);
    display: grid;
    gap: var(--gutter);
    justify-items: end;
  }
</style>
