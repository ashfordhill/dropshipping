import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("storefront mounts and meets WCAG 2.2 AA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Storefront" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("The storefront API is responding.");

  // P-04: storefront flows meet WCAG 2.2 AA, with a clean axe run.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
