import { writable } from "svelte/store";
import blockNavigation from "~lib/utils/blockNavigation";

export const references = writable<File[]>([]);

export function isReference(entry: FileSystemEntry): boolean {
  return /\.(jpg|jpeg|png|gif)$/.test(entry.name);
}

export function addReferences(files: File[]) {
  references.update((prev) => prev.concat(files));
}

export function removeReference(file: File) {
  references.update((files) => files.filter((f) => f !== file));
}

export async function clearReferences() {
  references.set([]);
}

references.subscribe((state) => {
  blockNavigation(state.length > 0);
});
