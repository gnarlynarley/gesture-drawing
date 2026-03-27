import getRandomFromArray from "./getRandomFromArray";
import { type Schedule } from "./schedule";

export type QueueItem<T> = {
  item: T;
  page: number;
  schedule: Schedule;
};

export default function createQueue<T>(arr: T[], schedules: Schedule[]) {
  let random = getRandomFromArray(arr);
  let state = $state({
    queue: [] as QueueItem<T>[],
    history: [] as QueueItem<T>[],
    current: null as QueueItem<T> | null,
    reachedEnd: false,
  });

  function next() {
    state.current = state.queue.shift() ?? null;
    if (state.current) {
      state.history.push(state.current);
    } else {
      state.reachedEnd = true;
    }
  }

  function skip() {
    if (state.current) {
      const next = random.get();
      if (next) {
        state.current.item = next;
      }
    }
  }

  function getNext(): QueueItem<T> | null {
    return state.queue[state.queue.length - 1] ?? null;
  }

  function hasNext(): boolean {
    return state.queue.length > 0;
  }

  function reset() {
    random = getRandomFromArray(arr);
    state.queue = [];
    outer: for (const schedule of schedules) {
      for (let index = 0; index < schedule.amount; index += 1) {
        const item = random.get();
        if (item === null) break outer;
        state.queue.push({
          item,
          page: index + 1,
          schedule,
        });
      }
    }
    state.history = [];
    state.current = null;
    state.reachedEnd = false;
  }

  reset();

  return { state, next, skip, getNext, hasNext, reset };
}
