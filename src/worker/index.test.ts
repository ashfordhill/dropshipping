import { env, exports } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDb } from "../db/client";
import { OrderWorkflow } from "./index";

describe("worker", () => {
  it("responds to GET /api/health", async () => {
    const response = await exports.default.fetch("http://example.com/api/health");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ ok: true });
  });

  it("leaves non-API paths to asset routing", async () => {
    const response = await exports.default.fetch("http://example.com/");
    expect(response.status).toBe(404);
  });

  it("queries D1 through Drizzle", async () => {
    const row = await createDb(env.DB).get<{ ok: number }>(sql`select 1 as ok`);
    expect(row).toEqual({ ok: 1 });
  });

  it("exposes the media, workflow, and email bindings", () => {
    expect(env.MEDIA).toBeTruthy();
    expect(env.ORDER_WORKFLOW).toBeTruthy();
    expect(env.EMAIL).toBeTruthy();
    expect(OrderWorkflow).toBeTruthy();
  });
});
