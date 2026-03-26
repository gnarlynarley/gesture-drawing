export type identifiable = { id: string | number };

export class ImageFileHandle {
  name: string;
  #value: File | FileSystemFileHandle;
  path: string;

  constructor(value: File | FileSystemFileHandle, path?: string) {
    this.#value = value;
    this.name = value.name;
    this.path =
      value instanceof File
        ? (value.webkitRelativePath ?? value.name)
        : (path ?? "");
  }

  getFile = async (): Promise<File> => {
    if (this.#value instanceof File) {
      return this.#value;
    }

    return this.#value.getFile();
  };
}
