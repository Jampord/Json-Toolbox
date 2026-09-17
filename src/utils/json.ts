import type { ParseResult } from "../types/json";

export function formatJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

export function parseJson(input: string): ParseResult {
  try {
    const value = JSON.parse(input);
    return { success: true, value };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { success: false, error: message };
  }
}
