import type { ImageFileHandle } from "$lib/models";
import getRandomFromArray, { type RandomGenerator } from "./getRandomFromArray";
import { type Schedule } from "./schedule";

export type PictureQueueItem = {
  type: "picture";
  id: string;
  amount: number;
  duration: number;
  image: ImageFileHandle;
  page: number;
};

export type BreakQueueItem = {
  type: "break";
  id: string;
  duration: number;
  item: null;
  page: number;
  label: string;
};

export type QueueItem = PictureQueueItem | BreakQueueItem;

export class ScheduleQueue {
  #schedules: Schedule[];
  #random: RandomGenerator<ImageFileHandle>;
  queue = $state<QueueItem[]>([]);
  currentIndex = $state<number>(-1);
  current = $derived<QueueItem | null>(this.queue[this.currentIndex] ?? null);
  reachedEnd = $derived(this.currentIndex !== -1 ? !this.current : false);

  constructor(images: ImageFileHandle[], schedules: Schedule[]) {
    this.#schedules = schedules;
    this.#random = getRandomFromArray(images);
    this.reset();
  }

  next() {
    this.currentIndex += 1;
  }

  skip() {
    if (!this.current) {
      console.warn("There is no current item to skip");
    } else if (this.current.type !== "picture") {
      console.warn("Current item being skipped is not of type picture");
    } else {
      const next = this.#random.get();
      if (!next) return;
      this.current.image = next;
    }
  }

  getNext(): QueueItem | null {
    return this.queue[this.currentIndex + 1] ?? null;
  }

  hasNext(): boolean {
    return !!this.getNext();
  }

  reset() {
    this.#random.reset();
    this.queue = [];
    this.currentIndex = -1;
    outer: for (const schedule of this.#schedules) {
      if (schedule.type === "break") {
        this.queue.push({
          type: "break",
          id: schedule.id,
          duration: schedule.duration,
          item: null,
          page: 1,
          label: schedule.label,
        });
      } else {
        for (let index = 0; index < schedule.amount; index += 1) {
          let image = this.#random.get();
          // Attempt to reset the randomizer once to retrieve a new image.
          if (image === null) {
            this.#random.reset();
            image = this.#random.get();
          }
          if (image === null) break outer;
          this.queue.push({
            ...schedule,
            image,
            page: index + 1,
          });
        }
      }
    }
  }
}
