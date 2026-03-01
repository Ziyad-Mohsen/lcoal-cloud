import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export type FileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);

export function formatFileSize(
  bytes: number,
  decimalCount = 2,
  unit?: FileSizeUnit,
) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return `0 ${unit || "B"}`;
  }

  const units: FileSizeUnit[] = ["B", "KB", "MB", "GB", "TB"];
  const base = 1024;

  let unitIndex = 0;

  if (unit) {
    unitIndex = units.indexOf(unit);
  } else {
    unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  }

  unitIndex = Math.min(unitIndex, units.length - 1);

  const value = bytes / Math.pow(base, unitIndex);

  return `${value.toFixed(decimalCount)} ${units[unitIndex]}`;
}

export const formatRelativeDate = (timeStamp: number) =>
  DateTime.fromMillis(timeStamp).toRelative();

export const joinPath = (segments: string[], relative: boolean = false) => {
  return (relative ? "" : "/") + segments.join("/");
};

export const copyToClipboard = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern approach
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback approach for insecure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure textarea is not visible or disruptive
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");

    document.body.removeChild(textArea);
  }
};
