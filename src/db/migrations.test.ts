import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function sqlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry === "meta") continue;
      found.push(...sqlFiles(path));
      continue;
    }
    if (entry.endsWith(".sql")) found.push(path);
  }
  return found;
}

describe("Drizzle migrations", () => {
  it("commits a first migration", () => {
    expect(existsSync("migrations/meta/_journal.json")).toBe(true);
    const journal = JSON.parse(readFileSync("migrations/meta/_journal.json", "utf8")) as {
      entries: unknown[];
    };
    expect(journal.entries.length).toBeGreaterThan(0);
    const files = sqlFiles("migrations");
    expect(files.length).toBeGreaterThan(0);
    expect(readFileSync(files[0] ?? "", "utf8").trim().length).toBeGreaterThan(0);
  });
});
