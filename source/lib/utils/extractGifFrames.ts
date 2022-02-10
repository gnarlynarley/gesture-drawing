import SuperGif from "../SuperGif";

export async function extractGif(image: HTMLImageElement) {
  image.style.display = "none";
  document.body.appendChild(image);
  const instance = new SuperGif({ gif: image }) as any;
  instance.init();
  await new Promise((r) => instance.load(r));
  const frames = instance.getFrames() as { data: ImageData; delay: number }[];

  return {
    frames,
  };
}
