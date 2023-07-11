import EventEmitter from "../EventEmitter";
import Worker from "./resizeImageBlob.worker?worker";

type EventValue = {
  id: number;
  resizedImageData: ImageData;
};

const worker = new Worker();
const emitter = new EventEmitter<EventValue>();

worker.addEventListener("message", (ev) => {
  emitter.emit(ev.data);
});

export default async function resizeImageBlob(
  blob: Blob,
  width: number,
  height: number,
) {
  const resizedImageData = await new Promise<ImageData>((resolve) => {
    const id = Math.random();
    const unsubscribe = emitter.on((value) => {
      if (value.id === id) {
        resolve(value.resizedImageData);
        unsubscribe();
      }
    });
    worker.postMessage({ id, blob, width, height });
  });

  return resizedImageData;
}
