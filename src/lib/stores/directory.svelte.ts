import { get, writable } from "svelte/store";
import { settings } from "./setting.svelte";
import { addNotification } from "./notifications.svelte";
import { ImageFileHandle } from "$lib/models";

// const FILE_SYSTEM_API_SUPPORTED = "showDirectoryPicker" in self;
const FILE_SYSTEM_API_SUPPORTED = false;

function isImageName(name: string): boolean {
  const extension = name.split(".").pop();
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
    case "bmp":
    case "ico":
      return true;
    default:
      return false;
  }
}

async function delve(
  dirHandle: FileSystemDirectoryHandle,
  files: FileSystemFileHandle[] = [],
): Promise<FileSystemFileHandle[]> {
  for await (const handle of dirHandle.values()) {
    if (handle.kind === "directory") {
      await delve(handle, files);
    } else {
      if (isImageName(handle.name)) {
        files.push(handle);
      }
    }
  }

  return files;
}

export let files = writable<ImageFileHandle[] | null>(null);

let lastDirectory: FileSystemDirectoryHandle | null = null;

settings.subscribe((state) => {
  if (state.directory) {
    if (state.directory !== lastDirectory) {
      lastDirectory = state.directory;
      delve(state.directory).then((value) => {
        const handles = value.map((handle) => new ImageFileHandle(handle));
        files.set(handles);
      });
    }
  }
});

files.subscribe((value) => {
  if (value) addNotification(`Loaded ${value.length} files.`);
});

export async function chooseDirectory() {
  if (FILE_SYSTEM_API_SUPPORTED) {
    const directory = await window.showDirectoryPicker();
    settings.set({
      ...get(settings),
      directory,
    });
  } else {
    const nextFiles = await new Promise<File[]>((resolve) => {
      const input = document.createElement("input");
      input.style.display = "none";
      input.style.visibility = "hidden";
      input.accept = "image/*";
      input.type = "file";
      input.webkitdirectory = true;
      input.multiple = true;
      input.addEventListener("change", () => {
        const files = Array.from(input.files ?? []);
        resolve(files);
        input.remove();
      });
      document.body.appendChild(input);
      input.click();
    });
    const handles = nextFiles.flatMap((file) =>
      isImageName(file.name) ? new ImageFileHandle(file) : [],
    );
    files.set(handles);
  }
}
