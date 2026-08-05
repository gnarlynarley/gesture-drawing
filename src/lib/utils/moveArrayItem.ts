export default function moveArrayItem<T>(
  arr: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const result = Array.from(arr);
  var element = result[fromIndex];
  result.splice(fromIndex, 1);
  result.splice(toIndex, 0, element);

  return result;
}
