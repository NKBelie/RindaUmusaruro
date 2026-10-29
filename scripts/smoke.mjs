import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs";

const base = "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
fs.mkdirSync("artifacts", { recursive: true });
const open = async (path) => {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
};
const login = async (label) => {
  await open("/login");
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.waitForURL("**/app/dashboard");
};
try {
  await open("/");
  await page.getByRole("heading", { name: /Protect your crops/ }).waitFor();
  await page.screenshot({
    path: "artifacts/landing-desktop.png",
    fullPage: true,
  });
  await login("Farmer");
  await page.getByRole("heading", { name: /Good morning/ }).waitFor();
  await page.screenshot({
    path: "artifacts/dashboard-desktop.png",
    fullPage: true,
  });
  await open("/app/farms?add=1");
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Farm name").fill("Judge Demo Maize");
  await dialog.getByLabel("Area (ha)").fill("2");
  await dialog
    .getByLabel("Village", { exact: true })
    .fill("Sample demo village");
  await dialog.getByLabel("Harvest date", { exact: true }).fill("2027-02-10");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await page
    .getByRole("heading", { name: "Judge Demo Maize", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "Judge Demo Maize", exact: true })
    .waitFor();
  await open("/app/monitoring?add=1");
  const farmId = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("rinda-data-v1")).farms.find(
        (f) => f.name === "Judge Demo Maize",
      ).id,
  );
  await page
    .getByRole("dialog")
    .getByLabel("Farm", { exact: true })
    .selectOption(farmId);
  await page
    .getByLabel("What did you notice?")
    .fill("Yellow patches observed on lower maize leaves.");
  await page.getByLabel("Report this concern").check();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await page
    .getByText("Yellow patches observed on lower maize leaves.", {
      exact: true,
    })
    .waitFor();
  await open("/app/detection");
  await page
    .getByLabel("Registered farm", { exact: true })
    .selectOption(farmId);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "demo-leaf.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZlS8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await page.getByRole("button", { name: "Analyze Crop" }).click();
  await page
    .getByRole("heading", { name: "Possible nutrient or moisture stress" })
    .waitFor();
  await page.getByRole("button", { name: "Send to extension officer" }).click();
  await page.getByRole("button", { name: "Saved & sent for review" }).waitFor();
  await login("Extension officer");
  await open("/app/reports");
  await page
    .getByRole("row")
    .filter({ hasText: "Possible nutrient or moisture stress" })
    .getByRole("button", { name: "Review case" })
    .click();
  await page
    .getByLabel("Your advice")
    .fill(
      "Please check soil moisture, document leaf changes, and schedule a field inspection.",
    );
  await page.getByRole("button", { name: "Send advice & resolve" }).click();
  await page
    .getByRole("row")
    .filter({ hasText: "Possible nutrient or moisture stress" })
    .getByText("Resolved", { exact: true })
    .waitFor();
  await login("Farmer");
  await open("/app/notifications");
  await page
    .getByRole("button")
    .filter({ hasText: "Your extension officer has replied" })
    .click();
  await page
    .getByRole("dialog")
    .getByText(/Please check soil moisture/)
    .waitFor();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await open("/app/harvest");
  await page.getByLabel("Farm & crop").selectOption(farmId);
  await page.getByLabel("Planted area (ha)").fill("2");
  await page.getByLabel("Expected yield (tonnes/ha)").fill("4");
  await page.getByLabel("Actual harvest (tonnes)").fill("7.5");
  await page.getByRole("button", { name: "Save harvest plan" }).click();
  const harvestRow = page
    .getByRole("row")
    .filter({ hasText: "Judge Demo Maize" });
  await harvestRow.getByText("8.00 t", { exact: true }).waitFor();
  const countBefore = await page.evaluate(
    () => JSON.parse(localStorage.getItem("rinda-data-v1")).harvests.length,
  );
  await harvestRow.getByRole("button", { name: "Edit plan" }).click();
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("rinda-data-v1")).harvests.length,
    ),
    countBefore,
    "Editing must not remove a saved plan",
  );
  await page.getByLabel("Actual harvest (tonnes)").fill("8.2");
  await page.getByRole("button", { name: "Save harvest plan" }).click();
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("rinda-data-v1")).harvests.length,
    ),
    countBefore,
    "Saving edits must update, not duplicate",
  );
  await open("/app/users");
  await page.waitForURL("**/app/dashboard");
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of [
    "/",
    "/login",
    "/register",
    "/app/dashboard",
    "/app/farms",
    "/app/monitoring",
    "/app/detection",
    "/app/weather",
    "/app/harvest",
    "/app/advice",
    "/app/notifications",
    "/app/reports",
    "/app/profile",
    "/app/settings",
  ]) {
    await open(path);
    await page.waitForTimeout(250);
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      view: innerWidth,
    }));
    assert.ok(
      width.scroll <= width.view + 1,
      `Horizontal overflow on ${path}: ${width.scroll}/${width.view}`,
    );
  }
  await open("/app/dashboard");
  await page.screenshot({
    path: "artifacts/dashboard-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "My Farms", exact: true }).click();
  await page.waitForURL("**/app/farms");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open("/register");
  await page.getByLabel("Full name", { exact: true }).fill("Test Farmer");
  await page.getByLabel("Phone number", { exact: true }).fill("0789999999");
  await page.getByLabel("Password", { exact: true }).fill("demo-pass-123");
  await page.getByLabel("Confirm password").fill("demo-pass-123");
  await page.getByLabel("Village", { exact: true }).fill("Sample Village");
  await page.getByRole("button", { name: "Get Started", exact: true }).click();
  await page.waitForURL("**/app/dashboard");
  await open("/forgot-password");
  await page.getByLabel("Phone number or email").fill("0789999999");
  await page.getByRole("button", { name: "Continue demo recovery" }).click();
  await page.waitForURL("**/reset-password");
  await page.getByLabel("Password", { exact: true }).fill("changed-pass-123");
  await page.getByLabel("Confirm password").fill("changed-pass-123");
  await page.getByRole("button", { name: "Reset demo password" }).click();
  await page.waitForURL("**/login");
  await page.getByLabel("Phone number or email").fill("0789999999");
  await page.getByLabel("Password", { exact: true }).fill("changed-pass-123");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.waitForURL("**/app/dashboard");
  await page.getByRole("button", { name: "EN" }).click();
  await page
    .getByRole("link", { name: "Imirima yanjye", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "RW" }).click();
  await login("Administrator");
  await open("/app/analytics");
  await page.getByRole("heading", { name: "Analytics", exact: true }).waitFor();
  assert.deepEqual(errors, [], "No unhandled frontend exceptions");
  console.log(
    "PASS: landing, farm persistence, observations, image assessment, officer resolution, farmer notification, harvest calculation/edit, role guard, 320px routes, mobile navigation, registration, password reset, language toggle, and admin analytics.",
  );
} catch (error) {
  console.error('Frontend errors:', errors);
  await page.screenshot({ path: 'artifacts/failure.png', fullPage: true });
  throw error;
} finally {
  await browser.close();
}
