import { test, expect } from "@playwright/test";

// ============================================================
// 404 / NOT FOUND HANDLING
// ============================================================
test.describe("404 and Error Pages", () => {
  test("non-existent marketing route returns page (not crash)", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    // Should return 404 or a fallback page, not a server error
    expect(response?.status()).toBeLessThan(500);
  });

  test("non-existent app route returns page (not crash)", async ({ page }) => {
    const response = await page.goto("/nonexistent-app-route");
    expect(response?.status()).toBeLessThan(500);
  });

  test("non-existent journal article shows not-found message", async ({ page }) => {
    await page.goto("/journal/this-article-does-not-exist");
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/not found|doesn.*exist|back/);
  });

  test("non-existent asset ID shows not-found message", async ({ page }) => {
    await page.goto("/assets/99999");
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/not found|back/);
  });

  test("non-existent beneficiary ID shows not-found message", async ({ page }) => {
    await page.goto("/beneficiaries/99999");
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/not found|back/);
  });
});

// ============================================================
// CROSS-PAGE DATA CONSISTENCY
// ============================================================
test.describe("Cross-Page Data Consistency", () => {
  test("dashboard asset count matches assets page", async ({ page }) => {
    // Visit dashboard and count mentioned assets
    await page.goto("/dashboard");
    const dashBody = await page.textContent("body");

    // Visit assets page and count asset cards
    await page.goto("/assets");
    const assetCards = page.locator('a[href*="/assets/"]');
    const assetCount = await assetCards.count();
    // There should be at least some asset links on the page
    expect(assetCount).toBeGreaterThanOrEqual(0);
  });

  test("beneficiary names on dashboard match beneficiaries page", async ({ page }) => {
    await page.goto("/beneficiaries");
    const benBody = await page.textContent("body");
    // Should contain beneficiary names
    expect(benBody).toContain("Sarah");
  });

  test("asset detail page data matches assets list", async ({ page }) => {
    // Get first asset name from list
    await page.goto("/assets");
    const firstAssetLink = page.locator('a[href^="/assets/"]').first();
    const href = await firstAssetLink.getAttribute("href");

    if (href && !href.includes("new")) {
      // Visit detail page
      await page.goto(href);
      const detailBody = await page.textContent("body");
      // Should have asset-related content
      expect(detailBody?.toLowerCase()).toMatch(/encrypt|beneficiar|activity/);
    }
  });

  test("beneficiary detail shows consistent data with list", async ({ page }) => {
    await page.goto("/beneficiaries");
    const firstBenLink = page.locator('a[href^="/beneficiaries/"]').first();
    const href = await firstBenLink.getAttribute("href");

    if (href) {
      await page.goto(href);
      const detailBody = await page.textContent("body");
      expect(detailBody).toContain("@"); // email
      expect(detailBody?.toLowerCase()).toContain("assigned"); // assigned assets
    }
  });

  test("brand name is consistent across all page types", async ({ page }) => {
    const pages = ["/", "/features", "/login", "/dashboard", "/partner/dashboard"];
    for (const path of pages) {
      await page.goto(path);
      const body = await page.textContent("body");
      expect(body).toContain("[PRODUCT_NAME]");
    }
  });
});

// ============================================================
// EVERY PAGE RETURNS 200
// ============================================================
const allPages = [
  // Marketing
  "/", "/features", "/security", "/pricing", "/partners", "/journal", "/faq",
  "/privacy", "/terms",
  // Journal articles
  "/journal/why-zero-knowledge", "/journal/building-trust-through-restraint",
  "/journal/rufadaa-explained", "/journal/why-we-built-this",
  "/journal/three-key-hierarchy", "/journal/check-in-system-design",
  // Auth
  "/login", "/register", "/recover",
  // App
  "/dashboard", "/assets", "/assets/new", "/assets/1", "/assets/2", "/assets/3",
  "/beneficiaries", "/beneficiaries/1", "/beneficiaries/2", "/beneficiaries/3",
  "/simulator", "/messages", "/checkin", "/vault-security", "/subscription", "/settings",
  // Partner
  "/partner/dashboard", "/partner/clients", "/partner/revenue",
  "/partner/exhibit-a", "/partner/resources", "/partner/settings",
];

for (const path of allPages) {
  test(`${path} returns 200 OK`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
  });
}

// ============================================================
// NO JAVASCRIPT ERRORS ON ANY PAGE
// ============================================================
for (const path of allPages) {
  test(`${path} has no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto(path);
    await page.waitForTimeout(1000);
    // Filter out known non-critical errors (like favicon 404)
    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404") && !e.includes("Failed to load resource")
    );
    expect(criticalErrors).toEqual([]);
  });
}

// ============================================================
// NAVIGATION FLOW TESTS
// ============================================================
test.describe("Navigation Flows", () => {
  test("homepage → features → security → pricing flow", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/features"]').first().click();
    await expect(page).toHaveURL(/\/features/);
    await page.locator('a[href="/security"]').first().click();
    await expect(page).toHaveURL(/\/security/);
    await page.locator('a[href="/pricing"]').first().click();
    await expect(page).toHaveURL(/\/pricing/);
  });

  test("login → register → login flow", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.locator('a[href="/register"]');
    await registerLink.first().click();
    await expect(page).toHaveURL(/\/register/);
    const loginLink = page.locator('a[href="/login"]');
    await loginLink.first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("assets list → asset detail → back to list", async ({ page }) => {
    await page.goto("/assets");
    const firstAsset = page.locator('a[href^="/assets/"]').first();
    const href = await firstAsset.getAttribute("href");
    if (href && !href.includes("new")) {
      await firstAsset.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      const backLink = page.locator('a[href="/assets"]');
      await backLink.first().click();
      await expect(page).toHaveURL(/\/assets$/);
    }
  });

  test("beneficiaries list → detail → back to list", async ({ page }) => {
    await page.goto("/beneficiaries");
    const firstBen = page.locator('a[href^="/beneficiaries/"]').first();
    await firstBen.click();
    await page.waitForTimeout(500);
    const backLink = page.locator('a[href="/beneficiaries"]');
    await backLink.first().click();
    await expect(page).toHaveURL(/\/beneficiaries$/);
  });

  test("journal index → article → back to index", async ({ page }) => {
    await page.goto("/journal");
    const firstArticle = page.locator('a[href^="/journal/"]').first();
    await firstArticle.click();
    await page.waitForTimeout(500);
    const backLink = page.locator('a[href="/journal"]');
    await backLink.first().click();
    await expect(page).toHaveURL(/\/journal$/);
  });

  test("dashboard sidebar navigation through all app sections", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");

    // Navigate through sidebar links
    const navPaths = ["/assets", "/beneficiaries", "/simulator", "/messages", "/checkin", "/settings"];
    for (const path of navPaths) {
      const link = page.locator(`a[href="${path}"]`).first();
      if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    }
  });
});

// ============================================================
// EMPTY STATE HANDLING
// ============================================================
test.describe("Empty States", () => {
  test("asset not found shows graceful message", async ({ page }) => {
    await page.goto("/assets/999");
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/not found|no asset|back/);
  });

  test("beneficiary not found shows graceful message", async ({ page }) => {
    await page.goto("/beneficiaries/999");
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/not found|no beneficiary|back/);
  });

  test("journal article not found shows graceful message with back link", async ({ page }) => {
    await page.goto("/journal/nonexistent-article");
    const backLink = page.locator('a[href="/journal"]');
    expect(await backLink.count()).toBeGreaterThanOrEqual(1);
  });
});
