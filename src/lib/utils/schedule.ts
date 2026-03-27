import * as v from 'valibot';
import createId from './createId';

export type Schedule = v.InferOutput<typeof scheduleSchema>;

export const scheduleSchema = v.object({
  id: v.fallback(v.string(), createId),
  amount: v.number(),
  duration: v.number(),
});
