import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("./leak-check.mjs", import.meta.url));

function initRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "leak-check-"));
  execFileSync("git", ["init", "-q"], { cwd: dir });
  mkdirSync(join(dir, "private"));
  writeFileSync(join(dir, ".gitignore"), "/private/\n");
  return dir;
}

function run(dir: string) {
  return spawnSync(process.execPath, [script], { cwd: dir, encoding: "utf8" });
}

describe("leak-check", () => {
  it("skips with a notice when the denylist is absent", () => {
    const dir = initRepo();
    const result = run(dir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("leak-check: skipped (private/denylist.txt is absent)");
  });

  it("prints only the file name when tracked text matches", () => {
    const dir = initRepo();
    writeFileSync(join(dir, "private", "denylist.txt"), "# note\r\nsuper-secret-token\r\n");
    writeFileSync(join(dir, "notes.txt"), "prefix super-secret-token suffix\n");
    const result = run(dir);
    // AD-05: the check reports the file and never the matched string.
    expect(result.status).toBe(1);
    expect(result.stdout.trim()).toBe("notes.txt");
    expect(result.stdout).not.toContain("super-secret-token");
    expect(result.stderr).not.toContain("super-secret-token");
  });

  it("matches a file by content hash", () => {
    const dir = initRepo();
    const bytes = Buffer.from("logo-bytes");
    const hash = createHash("sha256").update(bytes).digest("hex");
    writeFileSync(join(dir, "private", "denylist.txt"), `sha256:${hash.toUpperCase()}\n`);
    writeFileSync(join(dir, "mark.bin"), bytes);
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.stdout.trim()).toBe("mark.bin");
    expect(result.stdout).not.toContain(hash);
  });

  it("stays quiet when nothing matches", () => {
    const dir = initRepo();
    writeFileSync(join(dir, "private", "denylist.txt"), "# comment\n\nunused-token\n");
    writeFileSync(join(dir, "notes.txt"), "ordinary storefront copy\n");
    const result = run(dir);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe("");
  });
});
