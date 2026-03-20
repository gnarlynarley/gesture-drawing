import * as v from 'valibot';
import createId from './createId';

export type Schedule = v.InferOutput<typeof scheduleSchema>;

export const scheduleSchema = v.object({
  id: v.fallback(v.string(), createId),
  amount: v.number(),
  duration: v.number(),
});

export function getSchedule(
  schedules: Schedule[],
  item: number,
): Schedule | null {
  let acc = 0;
  for (const schedule of schedules) {
    const total = schedule.amount + acc;
    if (item - 1 < total) {
      return schedule;
    }
    acc += schedule.amount;
  }

  return null;
}

export function getCurrentPageFromSchedules(
  schedules: Schedule[],
  index: number,
): number {
  let acc = 0;
  for (const schedule of schedules) {
    const total = schedule.amount + acc;
    if (index < total + 1) {
      return index - acc;
    }
    acc += schedule.amount;
  }
  return index;
}
