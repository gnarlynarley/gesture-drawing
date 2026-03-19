export default function parseTime(seconds: number): string {
  const ss = Math.floor(seconds % 60);
  const mm = Math.floor(seconds / 60);

  return [mm, ss].map((v) => v.toString().padStart(2, "0")).join(":");
}
