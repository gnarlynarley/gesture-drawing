import * as v from 'valibot';
import createId from './createId';

export const pictureScheduleSchema = v.object({
  type: v.fallback(v.literal('picture'), () => 'picture' as const),
  id: v.fallback(v.string(), createId),
  amount: v.number(),
  duration: v.number(),
});

export const breakScheduleSchema = v.object({
  type: v.literal('break'),
  id: v.fallback(v.string(), createId),
  duration: v.number(),
});

export const scheduleSchema = v.union([breakScheduleSchema, pictureScheduleSchema]);

export type PictureSchedule = v.InferOutput<typeof pictureScheduleSchema>;
export type BreakSchedule = v.InferOutput<typeof breakScheduleSchema>;
export type Schedule = v.InferOutput<typeof scheduleSchema>;
