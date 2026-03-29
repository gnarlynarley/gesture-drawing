import { useRegisterSW } from "virtual:pwa-register/svelte";
import { addNotification } from "./stores/notifications.svelte";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered() {
    addNotification("Ready for offline use.");
  },
  onRegisterError(error) {
    console.error(error);
    addNotification("Something went wrong registering PWA.");
  },
});

export { offlineReady, needRefresh, updateServiceWorker };
