import createImage from "~lib/utils/image/createImage";
import * as localforage from "localforage";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";
import filterArray from "~lib/utils/filter-array";
import { resizeImage } from "~lib/utils/image/resizeImage";

const imageStore = localforage.createInstance({
  name: "images",
});

export interface ReferenceFile {
  id: string;
  name: string;
  file: Blob;
  thumbnail: Blob | null;
  date: Date;
}

async function createReferenceFileFromFile(file: File): Promise<ReferenceFile> {
  const src = URL.createObjectURL(file);
  const image = await createImage(src);
  const thumbnail = await resizeImage(image, 500, 500);
  return {
    id: uuid(),
    thumbnail,
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

export async function updateReference(reference: ReferenceFile) {
  await imageStore.setItem(reference.id, reference);
}

export async function addReferences(files: File[]) {
  const newReferences = await Promise.all(
    files.map(createReferenceFileFromFile),
  );
  references.update((prev) => prev.concat(newReferences));
  await Promise.all(
    newReferences.map((reference) => {
      updateReference(reference);
    }),
  );
}

export function removeReference(reference: ReferenceFile) {
  references.update((prev) => prev.filter((item) => item !== reference));
}

export async function clearReferences() {
  references.set([]);
  await imageStore.clear();
}
