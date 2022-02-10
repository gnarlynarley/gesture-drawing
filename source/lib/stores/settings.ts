import { writable } from "svelte/store";
import { getItem, setItem } from "../utils/localStorage";

const key = "settings:v1";
export const customDurationTimeValue = "custom";
export interface PracticeSettings {
  duration: number;
  color: boolean;
  flippedHorizontal: boolean;
  flippedVertical: boolean;
}

const defaultSettings: PracticeSettings = {
  duration: 30,
  color: true,
  flippedHorizontal: false,
  flippedVertical: false,
};

export const settings = writable(
  getItem<PracticeSettings>(key) ?? defaultSettings
);

settings.subscribe((value) => {
  setItem(key, value);
});
