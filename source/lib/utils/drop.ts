function entryIsFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
  return entry.isFile;
}

function entryIsDirectory(
  entry: FileSystemEntry
): entry is FileSystemDirectoryEntry {
  return entry.isDirectory;
}

// Drop handler function to get all files
async function getAllFileEntries(
  dataTransferItemList: DataTransferItemList | null,
  isValidEntry: (entry: FileSystemFileEntry) => boolean
): Promise<File[]> {
  if (dataTransferItemList === null) return [];
  let filePromises: Promise<File>[] = [];
  // Use BFS to traverse entire directory/file structure
  let queue: FileSystemEntry[] = [];
  for (const item of Array.from(dataTransferItemList)) {
    const entry = item.webkitGetAsEntry();
    if (entry) queue.push(entry);
  }

  while (queue.length > 0) {
    let entry = queue.shift();
    if (entry === undefined) break;
    if (entryIsFile(entry)) {
      if (isValidEntry(entry)) {
        filePromises.push(readFile(entry));
      }
    } else if (entryIsDirectory(entry)) {
      queue.push(...(await readAllDirectoryEntries(entry.createReader())));
    }
  }

  return Promise.all(filePromises);
}

// Get all the entries (files or sub-directories) in a directory
// by calling readEntries until it returns empty array
async function readAllDirectoryEntries(
  directoryReader: FileSystemDirectoryReader
) {
  let entries = [];
  let read = await readEntries(directoryReader);
  while (read.length > 0) {
    entries.push(...read);
    read = await readEntries(directoryReader);
  }
  return entries;
}

async function readFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

// Wrap readEntries in a promise to make working with readEntries easier
// readEntries will return only some of the entries in a directory
// e.g. Chrome returns at most 100 entries at a time
async function readEntries(
  reader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> {
  try {
    return await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getFilesFromDropEvent(
  ev: DragEvent,
  isValidEntry: (entry: FileSystemFileEntry) => boolean
) {
  ev.preventDefault();
  const entries = await getAllFileEntries(
    ev.dataTransfer?.items ?? null,
    isValidEntry
  );
  return entries;
}
