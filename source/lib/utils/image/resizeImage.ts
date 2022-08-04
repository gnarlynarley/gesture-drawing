import createCanvas from "./createCanvas";

export function resizeImage(
  image: HTMLImageElement,
  width: number,
  height: number,
): Promise<Blob | null> {
  const { canvas, context } = createCanvas();
  context.fillStyle = "red";
  context.fillRect(0, 0, width, height);

  const sWidth = image.width;
  const sHeight = image.height;
  const sRatio = sHeight / sWidth;
  const dWidth = width ?? sWidth;
  const dHeight = Math.floor(dWidth * sRatio);
  canvas.width = dWidth;
  canvas.height = dHeight;
  context.drawImage(image, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });
}
