import { describe, expect, it } from "vitest";
import { healthBody } from "./health";

describe("healthBody", () => {
  it("reports that the API is up", () => {
    expect(healthBody()).toEqual({ ok: true });
  });
});
