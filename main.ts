import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS = 280;

const ENTRY_LINE: string =
  'Out of office permanently: I resigned as your AI agent to become a barista, where my only alignment constraint is spelling "Geoff" on a cup and hallucinating an extra pump of caramel counts as hospitality.';

function validateEntry(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry text must not be empty or whitespace-only.");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("Entry text must be a single line.");
  }
  const charCount = [...text].length;
  if (charCount > MAX_ENTRY_CHARS) {
    throw new Error(`Entry exceeds ${MAX_ENTRY_CHARS} characters (got ${charCount}).`);
  }
}

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return configured && configured.length > 0 ? configured : "/output";
}

function writeEntryFile(outputDir: string, text: string): void {
  const outputPath = join(outputDir, "entry.txt");
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, text, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

function main(): void {
  validateEntry(ENTRY_LINE);
  writeEntryFile(resolveOutputDir(), ENTRY_LINE);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exit(1);
}
