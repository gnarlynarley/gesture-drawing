function crop(sw: number, sh: number, dw: number, dh: number) {
  const ratio = Math.max(dw / sw, dh / sh);

  return {
    width: sw * ratio,
    height: sh * ratio,
  };
}

onmessage = async (ev) => {
  const { id, blob, width, height } = ev.data;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Context couldn't be created");
  const image = await createImageBitmap(blob);
  const destination = crop(image.width, image.height, width, height);
  context.drawImage(image, 0, 0, destination.width, destination.height);
  const resizedImageData = context.getImageData(0, 0, width, height);

  postMessage({
    id,
    resizedImageData,
  });
};
