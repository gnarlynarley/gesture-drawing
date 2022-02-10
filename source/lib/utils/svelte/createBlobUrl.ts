import { readable } from "svelte/store";

export default function createBlobUrl(blob: Blob) {
  const url = URL.createObjectURL(blob);

  return readable(url, () => () => {
    if (url !== null) URL.revokeObjectURL(url);
  });
}
