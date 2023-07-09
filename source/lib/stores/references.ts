import * as localforage from "localforage";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";
import filterArray from "~lib/utils/filter-array";

const imageStore = localforage.createInstance({
  name: "images",
});

export interface ReferenceFile {
  id: string;
  name: string;
  file: Blob;
  date: Date;
}

async function createReferenceFileFromFile(file: File): Promise<ReferenceFile> {
  return {
    id: uuid(),
    name: file.name ?? "Untitled",
    file,
    date: new Date(),
  };
}

export const references = writable<ReferenceFile[]>([]);

imageStore
  .keys()
  .then((keys) =>
    Promise.all(keys.map((key) => imageStore.getItem<ReferenceFile>(key))),
  )
  .then((localReferences) =>
    references.update((prev) => prev.concat(filterArray(localReferences))),
  );

export function isReference(entry: FileSystemEntry): boolean {
  return /\.(jpg|jpeg|png|gif)$/.test(entry.name);
}

export async function addReferences(files: File[]) {
  try {
    const newReferences = await Promise.all(
      files.map(createReferenceFileFromFile),
    );
    references.update((prev) => prev.concat(newReferences));
    await Promise.all(
      newReferences.map((reference) => {
        return imageStore.setItem(reference.id, reference);
      }),
    );
  } catch (error) {
    console.error("error", error);
  }
}

export function removeReference(reference: ReferenceFile) {
  references.update((prev) => prev.filter((item) => item !== reference));
}

export async function clearReferences() {
  references.set([]);
  await imageStore.clear();
}
