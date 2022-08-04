export default function filterArray<T>(arr: (T | null)[]) {
  return arr.filter(Boolean) as T[];
}
