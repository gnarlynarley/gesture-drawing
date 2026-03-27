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

  function remove() {
    removeNotification(notificationId);
  }

  $effect(() => {
    const id = setTimeout(() => {
      remove();
    }, notificationDuration);

    return () => {
      clearTimeout(id);
    };
  });
</script>

<button
  type="button"
  class="notification"
  class:error={notification.type === "error"}
  onclick={remove}
>
  {notification.text}
</button>

<style>
  .notification {
    background-color: var(--color-primary);
    padding: var(--gutter);
    color: var(--color-background);
    border-radius: var(--border-radius);

    &.error {
      background-color: var(--color-error);
      color: var(--color-error-text);
    }
  }
</style>
