export default function createCanvas() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (context === null)
    throw new Error("Unable to retrieve context from canvas");

  return { canvas, context };
}
