const hoursRe = /(\d+?)h/;
const minutesRe = /(\d+?)m/;
const secondsRe = /(\d+?)s/;
const leftOverSecondsRe = /(\d+?)$/;

function parseNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

function parsePart(timeString: string, re: RegExp): number {
  const match = re.exec(timeString);
  if (match) {
    return parseNumber(match[1]) ?? 0;
  }

  return 0;
}

export default function parseTimeString(timeString: string): number {
  const trimmed = timeString.trim();
  const hours = parsePart(trimmed, hoursRe);
  const minutes = parsePart(trimmed, minutesRe);
  const seconds = parsePart(trimmed, secondsRe);
  const leftOver = parsePart(trimmed, leftOverSecondsRe);

  return hours * 60 * 60 + minutes * 60 + seconds + leftOver;
}
