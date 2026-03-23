export default function getRandomFromArray<T>(arr: T[]) {
  const queue = Array.from(arr);

  return {
    get(): T | null {
      const index = Math.floor(Math.random() * arr.length);
      const found = arr[index] ?? null;
      queue.splice(index, 1);

      return found;
    },
  };
}
