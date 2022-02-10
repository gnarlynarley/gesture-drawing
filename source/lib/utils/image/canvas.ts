export function clearCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

export async function drawResizedImage({
  canvas,
  context,
  image,
  width,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  image: HTMLImageElement;
  width?: number | null;
}) {
  clearCanvas(canvas, context);
  const sWidth = image.width;
  const sHeight = image.height;
  const sRatio = sHeight / sWidth;
  const dWidth = width ?? sWidth;
  const dHeight = Math.floor(dWidth * sRatio);
  canvas.width = dWidth;
  canvas.height = dHeight;
  context.drawImage(image, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight);
}
