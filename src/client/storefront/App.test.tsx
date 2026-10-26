import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("mounts the storefront shell", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      }),
    );

    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Storefront" })).toBeInTheDocument();
    expect(await screen.findByRole("status")).toHaveTextContent("The storefront API is responding.");
  });
});
