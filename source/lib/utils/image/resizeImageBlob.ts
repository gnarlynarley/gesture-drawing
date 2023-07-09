import EventEmitter from "../EventEmitter";
import Worker from "./resizeImageBlob.worker?worker";

type EventValue = {
  id: number;
  resizedImageData: ImageData;
};

const worker = new Worker();
const emitter = new EventEmitter<EventValue>();
const cache = new WeakMap<Blob, ImageData>();

worker.addEventListener("message", (ev) => {
  emitter.emit(ev.data);
});

export default async function resizeImageBlob(
  blob: Blob,
  width: number,
  height: number,
) {
  let resizedImageData = cache.get(blob);

  if (resizedImageData === undefined) {
    resizedImageData = await new Promise<ImageData>((resolve) => {
      const id = Math.random();
      const unsubscribe = emitter.on((value) => {
        if (value.id === id) {
          resolve(value.resizedImageData);
          unsubscribe();
        }
      });
      worker.postMessage({ id, blob, width, height });
    });
  }

  return resizedImageData;
}
