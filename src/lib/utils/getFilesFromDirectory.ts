export default function getFilesFromDirectory() {
  if ("showDirectoryPicker" in self) {
    return window.showDirectoryPicker();
  } else {
    throw new Error(
      "The File System Access API is not supported in this browser.",
    );
  }
}
