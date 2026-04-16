import { test, expect } from "@playwright/test";

// ============================================================
// PARTNER DASHBOARD
// ============================================================
test.describe("Partner Dashboard (/partner/dashboard)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/dashboard");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("has partner sidebar navigation", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("Overview");
    expect(body).toContain("Clients");
    expect(body).toContain("Revenue");
  });

  test("shows client vault health table", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/client|vault|health/);
  });

  test("shows revenue stats", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/revenue|earning|commission|\$/);
  });

  test("has quick action buttons", async ({ page }) => {
    const actionBtns = page.locator("a, button");
    expect(await actionBtns.count()).toBeGreaterThan(5);
  });

  test("all sidebar links have valid hrefs", async ({ page }) => {
    const sidebarLinks = page.locator('nav a[href*="/partner/"], aside a[href*="/partner/"]');
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      const href = await sidebarLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/\/partner\//);
    }
  });
});

// ============================================================
// PARTNER CLIENTS
// ============================================================
test.describe("Partner Clients (/partner/clients)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/clients");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays client list/table", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/client|name|email|status/);
  });

  test("has invite/add client button", async ({ page }) => {
    const inviteBtn = page.locator('button:has-text("Invite"), button:has-text("Add"), a:has-text("Invite"), a:has-text("Add")');
    expect(await inviteBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("client entries show status", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/active|pending|inactive/);
  });
});

// ============================================================
// PARTNER REVENUE
// ============================================================
test.describe("Partner Revenue (/partner/revenue)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/revenue");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("shows revenue figures", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toMatch(/\$/);
  });

  test("shows commission/payout information", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/commission|payout|earning|revenue/);
  });

  test("shows monthly revenue data", async ({ page }) => {
    const body = await page.textContent("body");
    // Revenue page shows month names and dollar amounts
    expect(body).toMatch(/\$/);
    expect(body?.toLowerCase()).toMatch(/jan|feb|mar|apr|month/);
  });
});

// ============================================================
// PARTNER EXHIBIT A
// ============================================================
test.describe("Partner Exhibit A (/partner/exhibit-a)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/exhibit-a");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("mentions RUFADAA compliance", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toMatch(/RUFADAA|Exhibit A|Chapter 2001/);
  });

  test("has client selector for document generation", async ({ page }) => {
    // Exhibit A has a client select dropdown; more fields appear after selection
    const selects = page.locator("select");
    expect(await selects.count()).toBeGreaterThanOrEqual(1);
  });

  test("has generate PDF button after selecting client", async ({ page }) => {
    // Select a client first to reveal the generate button
    const select = page.locator("select");
    await select.selectOption({ index: 1 });
    await page.waitForTimeout(500);
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Download"), button:has-text("Export")');
    expect(await generateBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("form fields are fillable", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        await input.fill("Test Value");
        await expect(input).toHaveValue("Test Value");
      }
    }
  });

  test("shows category checkboxes after selecting client", async ({ page }) => {
    const select = page.locator("select");
    await select.selectOption({ index: 1 });
    await page.waitForTimeout(500);
    const checkboxes = page.locator('input[type="checkbox"]');
    expect(await checkboxes.count()).toBeGreaterThanOrEqual(4);
    // Each checkbox should have a label
    const labels = page.locator("label");
    expect(await labels.count()).toBeGreaterThanOrEqual(4);
  });
});

// ============================================================
// PARTNER RESOURCES
// ============================================================
test.describe("Partner Resources (/partner/resources)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/resources");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays resource cards or links", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/resource|guide|template|download|document/);
  });

  test("has downloadable or viewable resources", async ({ page }) => {
    const resourceLinks = page.locator('a, button:has-text("Download"), button:has-text("View")');
    expect(await resourceLinks.count()).toBeGreaterThan(2);
  });
});

// ============================================================
// PARTNER SETTINGS
// ============================================================
test.describe("Partner Settings (/partner/settings)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partner/settings");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("has profile/firm settings form", async ({ page }) => {
    const inputs = page.locator("input, select, textarea");
    expect(await inputs.count()).toBeGreaterThanOrEqual(2);
  });

  test("has save button", async ({ page }) => {
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]');
    expect(await saveBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("form inputs are editable", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const currentValue = await input.inputValue();
        await input.fill("New Test Value");
        await expect(input).toHaveValue("New Test Value");
        await input.fill(currentValue); // restore
      }
    }
  });

  test("select elements have labels", async ({ page }) => {
    const selects = page.locator("select");
    const count = await selects.count();
    for (let i = 0; i < count; i++) {
      const select = selects.nth(i);
      const id = await select.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        expect(await label.count()).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test("has notification preferences", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/notification|email|alert/);
  });
});
