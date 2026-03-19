<script lang="ts">
  import {
    removeNotification,
    type Notification,
  } from "$lib/stores/notifications.svelte";

  type Props = {
    notification: Notification;
  };

  const { notification }: Props = $props();
  const notificationId = $derived(notification.id);
  const notificationDuration = $derived(notification.duration);

  $effect(() => {
    const id = setTimeout(() => {
      removeNotification(notificationId);
    }, notificationDuration);

    return () => {
      clearTimeout(id);
    };
  });
</script>

<div class="notification">
  {notification.text}
</div>

<style>
  .notification {
    background-color: var(--color-primary);
    padding: var(--gutter);
    color: var(--color-background);
    border-radius: var(--border-radius);
  }
</style>
