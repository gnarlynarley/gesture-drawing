function formatDoubleDigits(num: number) {
  return num < 10 ? `0${num}` : num.toString();
}

export default function formatTime(ms: number) {
  const seconds = formatDoubleDigits(Math.floor(ms / 1000) % 60);
  const minutes = formatDoubleDigits(Math.floor(ms / (1000 * 60)) % 60);
  const hours = formatDoubleDigits(Math.floor(ms / (1000 * 60 * 60)));

  return `${hours}:${minutes}:${seconds}`;
}
