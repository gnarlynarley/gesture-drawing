import { writable } from "svelte/store";
import blockNavigation from "~lib/utils/blockNavigation";

export interface ReferenceFile {
  name: string;
  file: Blob;
}

function createReferenceFileFromFile(file: File): ReferenceFile {
  return {
    name: file.name ?? "Untitled",
    file,
  };
}

export const references = writable<ReferenceFile[]>([]);

export function isReference(entry: FileSystemEntry): boolean {
  return /\.(jpg|jpeg|png|gif)$/.test(entry.name);
}

export function addReferences(files: File[]) {
  references.update((prev) =>
    prev.concat(files.map(createReferenceFileFromFile)),
  );
}

export function removeReference(reference: ReferenceFile) {
  references.update((prev) => prev.filter((item) => item !== reference));
}

export async function clearReferences() {
  references.set([]);
}

references.subscribe((state) => {
  blockNavigation(state.length > 0);
});
