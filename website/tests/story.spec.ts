import { expect, test, type Page } from "@playwright/test";
import { PNG } from "pngjs";

async function openStory(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Sector 6 Mosque" })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Preparing the architecture")).toBeHidden({ timeout: 30_000 });
  await page.waitForTimeout(1200);
  expect(errors, errors.join("\n")).toEqual([]);
}

async function scrollToFraction(page: Page, fraction: number) {
  await page.evaluate((value) => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: distance * value, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(900);
}

async function scrollToChapter(page: Page, id: string) {
  await page.evaluate((chapterId) => {
    document.getElementById(chapterId)?.scrollIntoView({ block: "center" });
  }, id);
  await page.waitForTimeout(1200);
}

async function canvasPixelRange(page: Page) {
  const screenshot = await page.locator("canvas").screenshot({
    path: "artifacts/desktop-canvas.png",
  });
  const png = PNG.sync.read(screenshot);
  let min = 255;
  let max = 0;
  let colored = 0;
  for (let y = 0; y < png.height; y += 6) {
    for (let x = 0; x < png.width; x += 6) {
      const index = (y * png.width + x) * 4;
      const red = png.data[index];
      const green = png.data[index + 1];
      const blue = png.data[index + 2];
      const luminance = red * 0.21 + green * 0.72 + blue * 0.07;
      min = Math.min(min, luminance);
      max = Math.max(max, luminance);
      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 5) colored += 1;
    }
  }
  return { range: max - min, colored };
}

test("desktop story renders and reaches each animation phase", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openStory(page);
  const pixels = await canvasPixelRange(page);
  expect(pixels.range).toBeGreaterThan(18);
  expect(pixels.colored).toBeGreaterThan(80);
  await page.screenshot({ path: "artifacts/desktop-hero.png", fullPage: false });

  await scrollToFraction(page, 0.12);
  await expect(page.locator("#light")).toHaveAttribute("data-active", "true");
  await page.screenshot({ path: "artifacts/desktop-calligraphy.png", fullPage: false });

  await scrollToFraction(page, 0.25);
  await expect(page.locator("#making")).toHaveAttribute("data-active", "true");
  await page.screenshot({ path: "artifacts/desktop-construction.png", fullPage: false });

  await scrollToFraction(page, 0.74);
  await expect(page.locator("#dome")).toHaveAttribute("data-active", "true");
  await page.screenshot({ path: "artifacts/desktop-dome.png", fullPage: false });
});

test("mobile story remains readable and uses the same scroll narrative", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  await page.screenshot({ path: "artifacts/mobile-hero.png", fullPage: false });
  await scrollToChapter(page, "minaret");
  await expect(page.locator("#minaret")).toHaveAttribute("data-active", "true");
  await page.screenshot({ path: "artifacts/mobile-minaret.png", fullPage: false });
});
