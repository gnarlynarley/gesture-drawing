import { describe, it, expect } from "vitest";
import {
  type Schedule,
  getCurrentPageFromSchedules,
  getSchedule,
} from "./schedule";

const schedules: Schedule[] = [
  { amount: 5, duration: 30 },
  { amount: 3, duration: 60 },
  { amount: 2, duration: 300 },
];

describe("getSchedule", () => {
  it.each([
    [1, 30],
    [5, 30],
    [6, 60],
    [9, 300],
  ])("should get the Schedule by item %i", (index, expected) => {
    const schedule = getSchedule(schedules, index);

    expect(schedule?.duration).toBe(expected);
  });

  it("should return null when exceeding the total schedules", () => {
    const schedule = getSchedule(schedules, 11);

    expect(schedule).toBe(null);
  });
});

describe("getCurrentPageFromSchedules", () => {
  it.each([
    [0, 1],
    [5, 1],
    [6, 2],
    [9, 2],
  ])("should get relative page number by item %i", (index, expected) => {
    const page = getCurrentPageFromSchedules(schedules, index);

    expect(page).toBe(expected);
  });
});
