export type identifiable = { id: string | number };

export class ImageFileHandle {
  name: string;
  #value: File | FileSystemFileHandle;

  constructor(value: File | FileSystemFileHandle) {
    this.#value = value;
    this.name = value.name;
  }

  getFile = async (): Promise<File> => {
    if (this.#value instanceof File) {
      return this.#value;
    }

    return this.#value.getFile();
  };
}
