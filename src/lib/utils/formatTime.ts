export default function formatTime(
  seconds: number,
  variant: "mm:ss" | "written" = "mm:ss",
): string {
  const ss = Math.floor(seconds % 60);
  const mm = Math.floor(seconds / 60);

  switch (variant) {
    case "written": {
      let parts: string[] = [];

      if (mm > 0) {
        parts.push(`${mm}m`);
      }

      if (ss > 0) {
        parts.push(`${ss}s`);
      }

      return parts.join(" ");
    }
    case "mm:ss": {
      return [mm, ss].map((s) => s.toString().padStart(2, "0")).join(":");
    }
  }
}
