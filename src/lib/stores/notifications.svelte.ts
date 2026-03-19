import { writable } from "svelte/store";

export type NotificationType = "message";
export type Notification = {
  id: string;
  type: NotificationType;
  text: string;
  duration: number;
};

const DEFAULT_DURATION = 3000;

export const notifications = $state({
  value: [] as Notification[],
});

export function addNotification(
  text: string,
  type: NotificationType = "message",
  duration = DEFAULT_DURATION,
) {
  notifications.value.push({
    id: Math.random().toString(),
    type,
    text,
    duration,
  });
}

export function removeNotification(id: string) {
  const found = notifications.value.findIndex((n) => n.id === id);
  if (found !== -1) {
    notifications.value.splice(found, 1);
  }
}
