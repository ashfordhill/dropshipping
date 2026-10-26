import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type WranglerConfig = {
  name?: string;
  route?: unknown;
  routes?: unknown;
  workers_dev?: boolean;
  preview_urls?: boolean;
  keep_vars?: boolean;
  d1_databases?: { binding?: string; database_name?: string }[];
  r2_buckets?: { binding?: string }[];
  workflows?: { binding?: string; class_name?: string }[];
  send_email?: { name?: string }[];
};

function parseJsonc(input: string): unknown {
  let out = "";
  let inString = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];
    if (inString) {
      out += char;
      if (char === "\\") {
        out += next ?? "";
        i += 1;
        continue;
      }
      if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }
    if (char === "/" && next === "/") {
      while (i < input.length && input[i] !== "\n") i += 1;
      i -= 1;
      continue;
    }
    if (char === "/" && next === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i += 1;
      i += 1;
      continue;
    }
    out += char;
  }
  return JSON.parse(out);
}

describe("wrangler.jsonc", () => {
  const config = parseJsonc(readFileSync("wrangler.jsonc", "utf8")) as WranglerConfig;

  it("keeps domains off the Worker config", () => {
    // AD-03: no routes, and workers.dev and preview URLs stay off.
    expect(config.route).toBeUndefined();
    expect(config.routes).toBeUndefined();
    expect(config.workers_dev).toBe(false);
    expect(config.preview_urls).toBe(false);
    expect(config.keep_vars).toBe(true);
    expect(config.name).toBe("storefront");
  });

  it("binds D1, R2, the order workflow, and email", () => {
    expect(config.d1_databases?.map((entry) => entry.binding)).toEqual(["DB"]);
    expect(config.d1_databases?.[0]?.database_name).toBe("storefront");
    expect(config.r2_buckets?.map((entry) => entry.binding)).toEqual(["MEDIA"]);
    expect(config.workflows).toEqual([
      {
        name: "order-workflow",
        binding: "ORDER_WORKFLOW",
        class_name: "OrderWorkflow",
      },
    ]);
    expect(config.send_email).toEqual([{ name: "EMAIL" }]);
  });
});
