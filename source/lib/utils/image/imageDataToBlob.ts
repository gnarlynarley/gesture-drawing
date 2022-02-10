import createCanvas from "./createCanvas";

export default async function imageDataToUrl(data: ImageData) {
  const { canvas, context } = createCanvas();
  canvas.width = data.width;
  canvas.height = data.height;
  context.putImageData(data, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve)
  );
  if (blob === null) throw new Error("Unable to create blob");
  const url = URL.createObjectURL(blob);

  return url;
}
