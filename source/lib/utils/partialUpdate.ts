import type { Writable } from "svelte/store";

function partialUpdate<T>(
  writable: Writable<T>,
  updater: Partial<T> | ((prev: T) => Partial<T>)
) {
  writable.update((prev) => {
    const update = typeof updater === "function" ? updater(prev) : updater;

    return {
      ...prev,
      ...update,
    };
  });
}

export default partialUpdate;
  