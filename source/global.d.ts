declare module "virtual:pwa-register/svelte" {
  // @ts-ignore ignore when svelte is not installed
  import { Writable } from "svelte/store";

  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: any) => void;
  };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable<boolean>;
    offlineReady: Writable<boolean>;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

declare module "virtual:pwa-register" {
  interface RegisterServiceWorkerOptions {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }
  export function registerSW(options?: RegisterServiceWorkerOptions);
}
