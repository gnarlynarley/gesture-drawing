export type identifiable = { id: string | number };

export class ImageFileHandle {
  name: string;
  #value: File | FileSystemFileHandle;
  path: string;
  extension: string;

  static MAX_DIMENSION = 600;

  constructor(value: File | FileSystemFileHandle, path?: string) {
    this.#value = value;
    this.name = value.name;
    this.path =
      value instanceof File
        ? (value.webkitRelativePath ?? value.name)
        : (path ?? "");
    const extension = this.path.split(".").pop();
    this.extension = extension ? `.${extension}` : "";
  }

  getFile = async (): Promise<File> => {
    if (this.#value instanceof File) {
      return this.#value;
    }

    // preload thumbnail
    this.getThumbnail();

    return this.#value.getFile();
  };

  #thumbnail: File | null = null;

  getThumbnail = async (): Promise<File> => {
    if (this.#thumbnail === null) {
      const file = await this.getFile();
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(
        ImageFileHandle.MAX_DIMENSION / bitmap.width,
        ImageFileHandle.MAX_DIMENSION / bitmap.height,
        1,
      );
      const targetWidth = Math.round(bitmap.width * scale);
      const targetHeight = Math.round(bitmap.height * scale);

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

      const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality: 0.8,
      });

      this.#thumbnail = new File([blob], "thumbnail.webm");
    }

    return this.#thumbnail;
  };
}
