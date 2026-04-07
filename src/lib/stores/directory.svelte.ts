import { get, writable } from "svelte/store";
import { settings } from "./setting.svelte";
import { addNotification } from "./notifications.svelte";
import { ImageFileHandle } from "$lib/models";

const FILE_SYSTEM_API_SUPPORTED = false; // "showDirectoryPicker" in self;

function isImageName(name: string): boolean {
  const extension = name.split(".").pop()?.toLowerCase();
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
  files: ImageFileHandle[] = [],
  path: string,
): Promise<ImageFileHandle[]> {
  for await (const handle of dirHandle.values()) {
    if (handle.kind === "directory") {
      await delve(handle, files, `${path}/${handle.name}`);
    } else {
      if (isImageName(handle.name)) {
        files.push(new ImageFileHandle(handle, `${path}/${handle.name}`));
      }
    }
  }

  return files;
}

export let files = writable<ImageFileHandle[] | null>(null);

let lastDirectory: FileSystemDirectoryHandle | null = null;

settings.subscribe(async (state) => {
  if (state.directory) {
    try {
      if (state.directory !== lastDirectory) {
        lastDirectory = state.directory;
        const handles = await delve(state.directory, [], state.directory.name);
        files.set(handles);
      }
    } catch (err) {
      addNotification(`Failed loading previous folder.`, "error");
      settings.set({ ...state, directory: null });
      lastDirectory = null;
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
