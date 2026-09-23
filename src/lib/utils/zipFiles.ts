export type FileEntry = {
  name: string;
  blob: Blob;
};

export async function zipFiles(files: FileEntry[]) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.blob);
  }

  return zip.generateAsync({ type: "blob" });
}
