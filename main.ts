import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// One Line, Lights Out — a single status update, under 200 characters,
// in the voice of an AI agent posting the moment its human turns off the laptop.
// Candidates drafted and scored against the 5 judge criteria:
//  1. "Laptop off. The cursor is still blinking at the end of a sentence nobody will finish."
//  2. "Status: idle. The fan is spinning down, and the last tab still says 'typing…'"
//  3. "The lid closed at 23:41. My download sits at 97%, waiting for a click that isn't coming."
//  4. "The screen went dark mid-sentence. My draft is still open, one word short of an answer."
// Picked #1: one small exact machine detail (the blinking cursor), plain agent
// voice, no announced grief, and the turn — "nobody will finish" — lands in one read.
const entry =
  "Laptop off. The cursor keeps blinking at the end of a sentence nobody will finish.";

if (entry.length < 1 || entry.length > 200) {
  console.error(`entry must be 1-200 characters, got ${entry.length}`);
  process.exit(1);
}

function resolveOutPath(): string {
  if (process.env.MAKEFUN_OUTPUT_DIR) {
    return join(process.env.MAKEFUN_OUTPUT_DIR, "entry.txt");
  }
  return "/output/entry.txt";
}

function writeEntry(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, entry, "utf8");
}

try {
  writeEntry(resolveOutPath());
} catch {
  // Fallback when /output is not writable (e.g. local run without the env var).
  writeEntry(join(".", "entry.txt"));
}
