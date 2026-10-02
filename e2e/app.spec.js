import { test, expect } from "@playwright/test";

async function login(page, returnTo) {
  if (!returnTo) await page.goto("/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("aarav@example.com");
  await page.getByLabel(/^Password/).fill("GharDemo123!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(returnTo || /account\/profile/);
}

test("search URLs, theme persistence and mobile navigation", async ({
  page,
}) => {
  await page.goto(
    "/properties?listingType=rent&category=apartment&maxPrice=80000",
  );
  await expect(page.getByText("1 properties", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Light-filled living in Jhamsikhel", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to light mode" }),
  ).toBeVisible();
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});

test("protected redirect, favorites and logout", async ({ page }) => {
  await page.goto("/account/properties/new");
  await expect(page).toHaveURL(/login\?next=/);
  await login(page, /account\/properties\/new$/);
  await page.goto("/properties/home-4");
  await page
    .getByRole("button", { name: "Save property", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Remove from saved homes" }).first(),
  ).toBeVisible();
  await page.goto("/account/favorites");
  await expect(
    page.getByRole("link", {
      name: "Modern comfort, thoughtful details",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Login", exact: true }),
  ).toBeVisible();
  await page.goto("/account/favorites");
  await expect(page).toHaveURL(/login\?next=/);
});

test("save draft, edit without losing data, publish and delete", async ({
  page,
}) => {
  await login(page);
  await page.goto("/account/properties/new");
  await page.getByRole("button", { name: "4. Publish" }).click();
  await page
    .getByRole("button", { name: "Publish property", exact: true })
    .click();
  await expect(
    page.getByText(
      "Some details need attention. Check the highlighted fields before publishing.",
    ),
  ).toBeVisible();
  await page.getByLabel(/^Property title/).fill("E2E quiet home");
  await page.getByLabel(/^Contact phone number/).fill("9800000000");
  await page
    .getByRole("button", { name: "Save as draft", exact: true })
    .click();
  await expect(page).toHaveURL(/account\/properties$/);
  const row = page.getByRole("row").filter({ hasText: "E2E quiet home" });
  await row.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page.getByLabel(/^Property title/)).toHaveValue(
    "E2E quiet home",
  );
  await page.getByLabel(/^Province/).selectOption("Bagmati");
  await page.getByLabel(/^District/).fill("Lalitpur");
  await page.getByLabel(/^Municipality/).fill("Lalitpur");
  await page.getByLabel(/^Area \/ neighborhood/).fill("Sanepa");
  await page.getByLabel(/^Total area/).fill("1200");
  await page.getByLabel(/^Price \(NPR\)/).fill("80000");
  await page
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("A spacious home with natural light and a private garden.");
  await page.getByRole("button", { name: "4. Publish" }).click();
  await page.getByRole("checkbox", { name: /I agree to the/ }).check();
  await page.getByRole("button", { name: "2. Photos" }).click();
  await page
    .getByLabel(/^Property photos/)
    .setInputFiles("public/images/hero.jpg");
  await expect(page.getByRole("button", { name: "Cover photo" })).toBeVisible();
  await page.getByRole("link", { name: "My properties", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Leave without saving?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await page.getByRole("button", { name: "4. Publish" }).click();
  await page
    .getByRole("button", { name: "Publish property", exact: true })
    .click();
  await expect(page).toHaveURL(/\/properties\/[^/]+$/);
  await expect(
    page.getByRole("heading", { name: "E2E quiet home" }),
  ).toBeVisible();
  await page.goto("/account/properties");
  await page
    .getByRole("row")
    .filter({ hasText: "E2E quiet home" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete listing", exact: true })
    .click();
  await expect(
    page.getByRole("row").filter({ hasText: "E2E quiet home" }),
  ).toHaveCount(0);
});

test("land listing supports traditional measurements and price on call", async ({
  page,
}) => {
  await login(page);
  await page.goto("/account/properties/new");
  await page.getByLabel(/^Property type/).selectOption("2bhk");
  await page.getByLabel(/^Property category/).selectOption("land");
  await expect(page.getByLabel(/^Land type/)).toHaveValue("standard");
  await expect(page.getByLabel("Bedrooms", { exact: true })).toHaveCount(0);
  await page.getByLabel(/^Area measurement system/).selectOption("hilly");
  await page.getByLabel(/^Ropani/).fill("1");
  await page.getByLabel(/^Property title/).fill("E2E hillside land");
  await page.getByLabel(/^Province/).selectOption("Bagmati");
  await page.getByLabel(/^District/).fill("Lalitpur");
  await page.getByLabel(/^Municipality/).fill("Godawari");
  await page.getByLabel(/^Area \/ neighborhood/).fill("Chapagaun");
  await page.getByRole("checkbox", { name: "Price on call" }).check();
  await page
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("A quiet plot with road access and a view of the hills.");
  await page.getByRole("button", { name: "4. Publish" }).click();
  await page.getByRole("checkbox", { name: /I agree to the/ }).check();
  await page.getByRole("button", { name: "2. Photos" }).click();
  await page
    .getByLabel("Property photos")
    .setInputFiles("public/images/hero.jpg");
  await expect(page.getByRole("button", { name: "Cover photo" })).toBeVisible();
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "4. Publish" }).click();
  await page
    .getByRole("button", { name: "Publish property", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "E2E hillside land" }),
  ).toBeVisible();
  await expect(page.getByText("16 aana", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Price on request", { exact: true }).first(),
  ).toBeVisible();
});
