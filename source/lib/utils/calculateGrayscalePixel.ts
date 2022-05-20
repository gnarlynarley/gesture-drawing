export default function calculateGrayscalePixel(
  r: number,
  g: number,
  b: number,
) {
  const average = 0.299 * r + 0.587 * g + 0.114 * b;

  return average;
}
