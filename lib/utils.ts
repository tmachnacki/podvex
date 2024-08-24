import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export const toTimeAgo = (timestamp: Date) => {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp.getTime()) / 1000);

  if (secondsAgo < 60) {
    // return secondsAgo < 10 ? 'just now' : `${secondsAgo}s ago`;
    return `just now`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60); // minute
    return `${minutesAgo}m ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600); // hour
    return `${hoursAgo}h ago`;
  } else if (secondsAgo < 604800) {
    const daysAgo = Math.floor(secondsAgo / 86400); // day
    return `${daysAgo}d ago`;
  } else {
    const weeksAgo = Math.floor(secondsAgo / 604800); // week
    return `${weeksAgo}w ago`;
  }
};
