import { writable } from "svelte/store";
export type PageName = "home" | "practice";

export const currentPage = writable<PageName>("home");

export function navigatePage(page: PageName) {
  currentPage.set(page);
}
