import { writable } from "svelte/store";
import { scheduleSchema, type Schedule } from "../utils/schedule";
import localforage from "localforage";
import * as v from "valibot";
import createId from "$lib/utils/createId";

const SETTINGS_KEY = "gesture-app.settings";
const INTERMISSION_TIME_DEFAULT = 3;
const SCHEDULES_DEFAULT: Schedule[] = [
  {
    id: createId(),
    amount: 10,
    duration: 30,
  },
  {
    id: createId(),
    amount: 5,
    duration: 120,
  },
  {
    id: createId(),
    amount: 2,
    duration: 300,
  },
  {
    id: createId(),
    amount: 1,
    duration: 600,
  },
];

type SettingsState = v.InferOutput<typeof settingsStateSchema>;

export const themes = ["dark" as const, "light" as const];

const settingsStateSchema = v.object({
  directory: v.union([v.instance(FileSystemDirectoryHandle), v.null()]),
  schedules: v.fallback(v.array(scheduleSchema), SCHEDULES_DEFAULT),
  intermissionTime: v.fallback(v.number(), INTERMISSION_TIME_DEFAULT),
  autoPlay: v.fallback(v.boolean(), true),
  sound: v.fallback(v.boolean(), true),
  theme: v.fallback(v.picklist(themes), "dark"),
});

export const settings = writable<SettingsState>({
  directory: null,
  schedules: SCHEDULES_DEFAULT,
  autoPlay: true,
  intermissionTime: INTERMISSION_TIME_DEFAULT,
  sound: true,
  theme: "dark",
});

export const pendingSettings = localforage
  .getItem(SETTINGS_KEY)
  .then((value) => {
    if (value !== null) {
      const parsed = v.safeParse(settingsStateSchema, value);
      if (parsed.success) settings.set(parsed.output);
    }
  });

settings.subscribe((value) => {
  localforage.setItem(SETTINGS_KEY, value);

  for (const theme of themes) {
    document.documentElement.classList.remove(`is-theme-${theme}`);
  }
  document.documentElement.classList.add(`is-theme-${value.theme}`);
});
