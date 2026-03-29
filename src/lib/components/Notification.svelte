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
  style={`--duration: ${notification.duration}`}
>
  {notification.text}
</button>

<style>
  .notification {
    --duration: 0;
    background-color: var(--color-primary);
    padding: var(--gutter);
    color: var(--color-background);
    border-radius: var(--border-radius);
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 2px;
      background: var(--color-background);
      transform-origin: bottom left;
      animation: shrink calc(var(--duration) * 1ms) forwards linear;
    }

    &.error {
      background-color: var(--color-error);
      color: var(--color-error-text);
    }
  }

  @keyframes shrink {
    0% {
      scale: 1 1;
    }
    100% {
      scale: 0 1;
    }
  }
</style>
