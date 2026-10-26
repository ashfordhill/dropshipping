import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const denylistPath = "private/denylist.txt";

if (!existsSync(denylistPath)) {
  console.log("leak-check: skipped (private/denylist.txt is absent)");
  process.exit(0);
}

const { strings, hashes } = parseDenylist(readFileSync(denylistPath, "utf8"));
const files = listFiles();
const hits = [];

for (const file of files) {
  let bytes;
  try {
    bytes = readFileSync(file);
  } catch {
    continue;
  }
  if (hashes.includes(createHash("sha256").update(bytes).digest("hex"))) {
    hits.push(file);
    continue;
  }
  if (strings.length === 0 || bytes.includes(0)) continue;
  const text = bytes.toString("utf8").toLowerCase();
  if (strings.some((entry) => text.includes(entry))) hits.push(file);
}

if (hits.length > 0) {
  for (const file of hits) console.log(file);
  process.exit(1);
}

function parseDenylist(raw) {
  const strings = [];
  const hashes = [];
  for (const line of raw.replaceAll("\r", "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed.toLowerCase().startsWith("sha256:")) {
      hashes.push(trimmed.slice("sha256:".length).trim().toLowerCase());
      continue;
    }
    strings.push(trimmed.toLowerCase());
  }
  return { strings, hashes };
}

function listFiles() {
  const listed = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], {
    encoding: "buffer",
  });
  return listed
    .toString("utf8")
    .split("\0")
    .filter((file) => file.length > 0);
}
