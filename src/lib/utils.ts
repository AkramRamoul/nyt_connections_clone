import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function saveGameState(state: any) {
  localStorage.setItem("connections-game", JSON.stringify(state));
}

export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export type Puzzle = {
  date: string;
  groups: {
    category: string;
    color: string;
    words: string[];
  }[];
};
