import {
  getSchedule,
  getCurrentPageFromSchedules,
  type Schedule,
} from './schedule';

export type QueueItem<T> = {
  item: T;
  page: number;
  schedule: Schedule;
};

export default function createQueue<T>(arr: T[], schedules: Schedule[]) {
  let state = $state({
    queue: Array.from(arr),
    history: [] as QueueItem<T>[],
    current: null as QueueItem<T> | null,
    reachedEnd: false,
  });

  function createNext(): QueueItem<T> | null {
    const randomIndex = Math.floor(Math.random() * state.queue.length);
    const item = state.queue[randomIndex];
    const schedule = getSchedule(schedules, state.history.length + 1);
    const page = getCurrentPageFromSchedules(
      schedules,
      state.history.length + 1,
    );
    if (!item || !schedule) {
      return null;
    }

    return { item, page, schedule };
  }

  function getNext() {
    const next = createNext();
    if (next === null) {
      state.reachedEnd = true;
      return;
    }
    state.current = next;
    state.history.push(state.current);
    state.queue.splice(state.queue.indexOf(next.item), 1);
  }

  function hasNext(): boolean {
    return !!createNext();
  }

  function reset() {
    state.queue = Array.from(arr);
    state.history = [];
    state.current = null;
    state.reachedEnd = false;
  }

  return { state, getNext, hasNext, reset };
}
