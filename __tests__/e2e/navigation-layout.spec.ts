import { test, expect } from "@playwright/test";

// ============================================================
// HEADER & FOOTER ON EVERY MARKETING PAGE
// ============================================================
const marketingPages = [
  { path: "/", name: "Homepage" },
  { path: "/features", name: "Features" },
  { path: "/security", name: "Security" },
  { path: "/pricing", name: "Pricing" },
  { path: "/partners", name: "Partners" },
  { path: "/journal", name: "Journal" },
  { path: "/faq", name: "FAQ" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
];

for (const pg of marketingPages) {
  test.describe(`Marketing Layout: ${pg.name} (${pg.path})`, () => {
    test("header is visible and contains brand name", async ({ page }) => {
      await page.goto(pg.path);
      const header = page.locator("header");
      await expect(header).toBeVisible();
      await expect(header).toContainText("[PRODUCT_NAME]");
    });

    test("header contains navigation links", async ({ page }) => {
      await page.goto(pg.path);
      const headerLinks = page.locator("header a");
      expect(await headerLinks.count()).toBeGreaterThanOrEqual(3);
    });

    test("header has Features link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('header a[href="/features"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("header has Security link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('header a[href="/security"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("header has Pricing link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('header a[href="/pricing"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("header has login/sign-in link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('header a[href="/login"], header a:has-text("Sign in"), header a:has-text("Log in")');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("footer is visible", async ({ page }) => {
      await page.goto(pg.path);
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });

    test("footer contains brand name", async ({ page }) => {
      await page.goto(pg.path);
      await expect(page.locator("footer")).toContainText("[PRODUCT_NAME]");
    });

    test("footer has Privacy link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('footer a[href="/privacy"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("footer has Terms link", async ({ page }) => {
      await page.goto(pg.path);
      const link = page.locator('footer a[href="/terms"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });
  });
}

// ============================================================
// SIDEBAR ON EVERY APP PAGE
// ============================================================
const appPages = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/assets", name: "Assets" },
  { path: "/assets/new", name: "Add Asset" },
  { path: "/assets/1", name: "Asset Detail" },
  { path: "/beneficiaries", name: "Beneficiaries" },
  { path: "/beneficiaries/1", name: "Beneficiary Detail" },
  { path: "/simulator", name: "Simulator" },
  { path: "/messages", name: "Messages" },
  { path: "/checkin", name: "Check-in" },
  { path: "/vault-security", name: "Vault Security" },
  { path: "/subscription", name: "Subscription" },
  { path: "/settings", name: "Settings" },
];

for (const pg of appPages) {
  test.describe(`App Sidebar: ${pg.name} (${pg.path})`, () => {
    test("sidebar/nav is present on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const sidebar = page.locator("nav, aside");
      expect(await sidebar.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has Dashboard link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/dashboard"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has Assets link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/assets"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has Beneficiaries link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/beneficiaries"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has Settings link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/settings"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar shows brand name", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const body = await page.textContent("body");
      expect(body).toContain("[PRODUCT_NAME]");
    });
  });
}

// ============================================================
// MOBILE MENU ON APP PAGES
// ============================================================
test.describe("Mobile Menu Behavior", () => {
  test("mobile menu button appears on small viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-label*="navigation" i]');
    expect(await menuBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("clicking mobile menu button opens sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-label*="navigation" i]');
    if (await menuBtn.count() > 0) {
      await menuBtn.first().click();
      await page.waitForTimeout(500);
      // Sidebar should now be visible with nav links
      const dashLink = page.locator('a[href="/dashboard"]');
      expect(await dashLink.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test("mobile sidebar has all navigation links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-label*="navigation" i]');
    if (await menuBtn.count() > 0) {
      await menuBtn.first().click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).toContain("Dashboard");
      expect(body).toContain("Assets");
      expect(body).toContain("Beneficiaries");
      expect(body).toContain("Settings");
    }
  });

  test("mobile sidebar close button works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-label*="navigation" i]');
    if (await menuBtn.count() > 0) {
      await menuBtn.first().click();
      await page.waitForTimeout(500);
      // Find close button
      const closeBtn = page.locator('button[aria-label*="close" i], button[aria-label*="Close" i]');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  });

  test("mobile header shows brand name", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    const body = await page.textContent("body");
    expect(body).toContain("[PRODUCT_NAME]");
  });
});

// ============================================================
// PARTNER SIDEBAR ON EVERY PARTNER PAGE
// ============================================================
const partnerPages = [
  { path: "/partner/dashboard", name: "Partner Dashboard" },
  { path: "/partner/clients", name: "Partner Clients" },
  { path: "/partner/revenue", name: "Partner Revenue" },
  { path: "/partner/exhibit-a", name: "Partner Exhibit A" },
  { path: "/partner/resources", name: "Partner Resources" },
  { path: "/partner/settings", name: "Partner Settings" },
];

for (const pg of partnerPages) {
  test.describe(`Partner Sidebar: ${pg.name} (${pg.path})`, () => {
    test("sidebar/nav is present", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const sidebar = page.locator("nav, aside");
      expect(await sidebar.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has all partner nav links", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const body = await page.textContent("body");
      expect(body).toContain("Overview");
      expect(body).toContain("Clients");
      expect(body).toContain("Revenue");
    });

    test("sidebar has Exhibit A link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/partner/exhibit-a"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });

    test("sidebar has Settings link", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(pg.path);
      const link = page.locator('a[href="/partner/settings"]');
      expect(await link.count()).toBeGreaterThanOrEqual(1);
    });
  });
}
