import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique invite code: e.g. "ALEX4729"
const nanoidAlpha = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);
const nanoidNum = customAlphabet("0123456789", 4);

export function generateCode(firstName: string): string {
  const prefix = firstName
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  return prefix + nanoidNum();
}

export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50) +
    "-" +
    nanoidAlpha()
  );
}

export function formatEventDate(date: Date | string): string {
  return format(new Date(date), "EEEE d MMMM yyyy", { locale: fr });
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: fr });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Safe JSON parse
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
