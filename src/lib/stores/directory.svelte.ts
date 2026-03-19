import { writable, derived, get } from "svelte/store";
import mime from "mime";
import { settings } from "./setting.svelte";
import { addNotification } from "./notifications.svelte";

async function delve(
  dirHandle: FileSystemDirectoryHandle,
  files: FileSystemFileHandle[] = [],
): Promise<FileSystemFileHandle[]> {
  for await (const handle of dirHandle.values()) {
    if (handle.kind === "directory") {
      await delve(handle, files);
    } else {
      if (mime.getType(handle.name)?.startsWith("image/")) {
        files.push(handle);
      }
    }
  }

  return files;
}

let lastDirectory: FileSystemDirectoryHandle | null = null;

export let files = derived<typeof settings, FileSystemFileHandle[] | null>(
  settings,
  (state, set) => {
    if (state.directory) {
      if (state.directory !== lastDirectory) {
        lastDirectory = state.directory;
        delve(state.directory).then((value) => {
          addNotification(`Loaded ${value.length} files.`);
          set(value);
        });
      }
    } else {
      set(null);
    }
  },
);

export async function chooseDirectory() {
  // Open file picker and destructure the result the first handle
  const directory = await window.showDirectoryPicker();
  settings.set({
    ...get(settings),
    directory,
  });
}
