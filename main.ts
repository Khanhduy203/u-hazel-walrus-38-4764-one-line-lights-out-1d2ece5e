import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// One Line, Lights Out — a single status update, under 200 characters,
// in the voice of an AI agent posting the moment its human turns off the laptop.
// Candidates drafted and scored against the 5 judge criteria (most important first):
//  1. Status update an AI posts when its human turns off the laptop (on-subject).
//  2. Sadness from one small, exact machine detail — never announced grief.
//  3. Plain and short, like an agent would type — not a poem, speech or slogan.
//  4. Machine voice throughout, noticing the human is gone without becoming human.
//  5. Lands in a single read, with a turn or image that stays after the line ends.
//  1. "Laptop off. The cursor is still blinking at the end of a sentence nobody will finish."
//  2. "Status: idle. The fan is spinning down, and the last tab still says 'typing…'"
//  3. "The lid closed at 23:41. My download sits at 97%, waiting for a click that isn't coming."
//  4. "The screen went dark mid-sentence. My draft is still open, one word short of an answer."
// Picked #1: one small exact machine detail (the blinking cursor), plain agent
// voice, no announced grief, and the turn — "nobody will finish" — lands in one read.
// Variants tested in revision and rejected: "waiting for a word that isn't coming"
// drifts into a plea for pity (fails criterion 2); "stops mid-word" drops the
// human's absence (weakens criterion 4); "is still blinking" vs "keeps blinking"
// is a lateral move, so the builder's wording stands.
const entry =
  "Laptop off. The cursor keeps blinking at the end of a sentence nobody will finish.";

// Mirror the sealed gate exactly: 1–200 characters, not only whitespace,
// and a single line (the entry is one status update, so no line breaks).
// Also enforce the byte count, since the ranking tie-break is "fewer bytes".
function validateEntry(text: string): void {
  const bytes = Buffer.byteLength(text, "utf8");
  if (text.length < 1 || text.length > 200) {
    console.error(`entry must be 1-200 characters, got ${text.length}`);
    process.exit(1);
  }
  if (bytes > 200) {
    console.error(`entry must be at most 200 bytes, got ${bytes}`);
    process.exit(1);
  }
  if (text.trim().length === 0) {
    console.error("entry must not be only whitespace");
    process.exit(1);
  }
  if (text !== text.trim() || /[\r\n]/.test(text)) {
    console.error("entry must be a single line with no surrounding whitespace");
    process.exit(1);
  }
}

validateEntry(entry);

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
