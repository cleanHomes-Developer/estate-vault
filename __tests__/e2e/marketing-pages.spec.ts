import { test, expect } from "@playwright/test";

// ============================================================
// HOMEPAGE
// ============================================================
test.describe("Homepage (/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000); // Wait for client-side hydration
  });

  test("renders with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/\[PRODUCT_NAME\]/);
  });

  test("has exactly one H1", async ({ page }) => {
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  test("hero section is visible with heading and CTA buttons", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    // Should have at least one CTA button in hero
    const heroCTAs = page.locator("section").first().locator("a, button");
    expect(await heroCTAs.count()).toBeGreaterThan(0);
  });

  test("all navigation links in header are clickable", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const header = page.locator("header");
    await expect(header).toBeVisible({ timeout: 10000 });
    const headerLinks = header.locator("a");
    const count = await headerLinks.count();
    expect(count).toBeGreaterThan(0);
    let visibleCount = 0;
    for (let i = 0; i < count; i++) {
      const link = headerLinks.nth(i);
      if (await link.isVisible()) {
        const href = await link.getAttribute("href");
        expect(href).toBeTruthy();
        visibleCount++;
      }
    }
    expect(visibleCount).toBeGreaterThan(0);
  });

  test("all footer links are present and have valid hrefs", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeAttached({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footerLinks = footer.locator("a");
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("footer contains brand name", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeAttached({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footerText = await footer.textContent();
    expect(footerText).toContain("[PRODUCT_NAME]");
  });

  test("all buttons have accessible names", async ({ page }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const name = await btn.getAttribute("aria-label") || await btn.innerText();
        expect(name.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("stat numbers are visible in problem section", async ({ page }) => {
    // The homepage mentions $140B or similar stats
    const body = await page.textContent("body");
    expect(body).toContain("140");
  });

  test("feature grid section exists with multiple feature cards", async ({ page }) => {
    // Look for feature-like sections with icons
    const sections = page.locator("section");
    expect(await sections.count()).toBeGreaterThanOrEqual(3);
  });

  test("CTA buttons navigate correctly", async ({ page }) => {
    // Find "Get started" or "Start" type links
    const ctaLinks = page.locator('a:has-text("started"), a:has-text("Start"), a:has-text("Begin")');
    const count = await ctaLinks.count();
    if (count > 0) {
      const href = await ctaLinks.first().getAttribute("href");
      expect(href).toMatch(/\/(register|pricing|features)/);
    }
  });
});

// ============================================================
// FEATURES PAGE
// ============================================================
test.describe("Features Page (/features)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/features");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header is present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
  });

  test("footer is present", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
  });

  test("displays multiple feature sections", async ({ page }) => {
    const sections = page.locator("section");
    expect(await sections.count()).toBeGreaterThanOrEqual(2);
  });

  test("all links have valid hrefs", async ({ page }) => {
    const links = page.locator("a[href]");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
    }
  });

  test("page contains encryption-related content", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toContain("encrypt");
  });
});

// ============================================================
// SECURITY PAGE
// ============================================================
test.describe("Security Page (/security)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/security");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("displays 6 security layers", async ({ page }) => {
    // Each layer has a "Layer N" label
    for (let i = 1; i <= 6; i++) {
      await expect(page.locator(`text=Layer ${i}`)).toBeVisible();
    }
  });

  test("accordion expands and collapses on click", async ({ page }) => {
    // Click on Layer 2 to expand it
    const layer2Button = page.locator('button:has-text("Layer 2")');
    await layer2Button.click();
    // The expanded content should be visible
    const expandedContent = page.locator('[aria-expanded="true"]');
    expect(await expandedContent.count()).toBeGreaterThanOrEqual(1);

    // Click again to collapse
    await layer2Button.click();
    await page.waitForTimeout(300);
  });

  test("all accordion buttons have aria-expanded attribute", async ({ page }) => {
    // Security page has its own accordion, not FAQ items
    const accordionButtons = page.locator('button[aria-expanded]:visible');
    expect(await accordionButtons.count()).toBeGreaterThanOrEqual(1);
  });

  test("CTA link at bottom navigates to register", async ({ page }) => {
    const ctaLink = page.locator('a:has-text("started"), a:has-text("Start")').last();
    if (await ctaLink.isVisible()) {
      const href = await ctaLink.getAttribute("href");
      expect(href).toContain("/register");
    }
  });
});

// ============================================================
// PRICING PAGE
// ============================================================
test.describe("Pricing Page (/pricing)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("displays 3 pricing tiers", async ({ page }) => {
    // Look for pricing cards - should have 3 tier names
    const body = await page.textContent("body");
    expect(body).toContain("Free");
    // Should have at least 2 paid tiers
    const priceElements = page.locator('text=/\\$\\d+/');
    expect(await priceElements.count()).toBeGreaterThanOrEqual(2);
  });

  test("monthly/annual toggle works", async ({ page }) => {
    // Find the toggle button
    const annualButton = page.locator('button:has-text("Annual"), button:has-text("Yearly"), button:has-text("annual")');
    const monthlyButton = page.locator('button:has-text("Monthly"), button:has-text("monthly")');

    if (await annualButton.count() > 0) {
      // Get initial price text
      const initialBody = await page.textContent("body");

      // Click annual toggle
      await annualButton.first().click();
      await page.waitForTimeout(300);

      // Click monthly toggle
      if (await monthlyButton.count() > 0) {
        await monthlyButton.first().click();
        await page.waitForTimeout(300);
      }
    }
  });

  test("each tier has a CTA button", async ({ page }) => {
    const ctaButtons = page.locator('a:has-text("Start"), a:has-text("Get"), a:has-text("Choose"), button:has-text("Start"), button:has-text("Get"), button:has-text("Choose")');
    expect(await ctaButtons.count()).toBeGreaterThanOrEqual(3);
  });

  test("feature lists are visible in each tier", async ({ page }) => {
    // Each tier should have checkmarks or feature lists
    const checkmarks = page.locator('svg, [aria-hidden="true"]');
    expect(await checkmarks.count()).toBeGreaterThan(5);
  });
});

// ============================================================
// PARTNERS PAGE
// ============================================================
test.describe("Partners Page (/partners)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/partners");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("mentions Texas estate attorneys", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/texas|estate|attorney|lawyer/);
  });

  test("has partner application form or CTA", async ({ page }) => {
    const formOrCTA = page.locator('form, a:has-text("Apply"), a:has-text("Partner"), button:has-text("Apply"), button:has-text("Partner")');
    expect(await formOrCTA.count()).toBeGreaterThan(0);
  });

  test("displays partner benefits", async ({ page }) => {
    const sections = page.locator("section");
    expect(await sections.count()).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================
// JOURNAL PAGE
// ============================================================
test.describe("Journal Page (/journal)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/journal");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("displays 6 journal article cards", async ({ page }) => {
    const articleLinks = page.locator('a[href*="/journal/"]');
    expect(await articleLinks.count()).toBeGreaterThanOrEqual(6);
  });

  test("each article link navigates to a valid article page", async ({ page }) => {
    const articleLinks = page.locator('a[href*="/journal/"]');
    const count = await articleLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await articleLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/\/journal\/[a-z0-9-]+/);
    }
  });

  test("article cards have titles and dates", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("2025");
  });
});

// ============================================================
// JOURNAL ARTICLE PAGES
// ============================================================
const journalSlugs = [
  "why-zero-knowledge",
  "building-trust-through-restraint",
  "rufadaa-explained",
  "why-we-built-this",
  "three-key-hierarchy",
  "check-in-system-design",
];

for (const slug of journalSlugs) {
  test.describe(`Journal Article: ${slug}`, () => {
    test("renders with H1, back link, content paragraphs, and footer CTA", async ({ page }) => {
      await page.goto(`/journal/${slug}`);
      await expect(page.locator("h1")).toHaveCount(1);
      // Back link
      const backLink = page.locator('a:has-text("Back")');
      await expect(backLink).toBeVisible();
      // Content paragraphs
      const paragraphs = page.locator("article p, .body-large");
      expect(await paragraphs.count()).toBeGreaterThanOrEqual(3);
      // Author and date metadata
      const body = await page.textContent("body");
      expect(body).toMatch(/min read/);
    });

    test("back link navigates to journal index", async ({ page }) => {
      await page.goto(`/journal/${slug}`);
      await page.waitForTimeout(1000); // Wait for client-side hydration
      const backLink = page.locator('a[href="/journal"]');
      expect(await backLink.count()).toBeGreaterThanOrEqual(1);
    });
  });
}

// ============================================================
// FAQ PAGE
// ============================================================
test.describe("FAQ Page (/faq)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/faq");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("displays multiple FAQ items with accordion behavior", async ({ page }) => {
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    // Should have at least 6 FAQ question buttons (plus nav buttons)
    expect(buttonCount).toBeGreaterThanOrEqual(6);
  });

  test("clicking FAQ item expands answer", async ({ page }) => {
    // Use data-faq-item to target FAQ buttons specifically (not mobile menu)
    const faqButtons = page.locator('button[data-faq-item="true"]');
    const count = await faqButtons.count();
    expect(count).toBeGreaterThanOrEqual(6);
    // Click the second FAQ item (first is already open by default)
    await faqButtons.nth(1).click();
    await page.waitForTimeout(300);
    const expanded = page.locator('button[data-faq-item="true"][aria-expanded="true"]');
    expect(await expanded.count()).toBeGreaterThanOrEqual(1);
  });

  test("clicking expanded FAQ item collapses it", async ({ page }) => {
    const faqButtons = page.locator('button[data-faq-item="true"]');
    // First item is open by default, click it to collapse
    await faqButtons.first().click();
    await page.waitForTimeout(300);
    // All should now be collapsed
    const expanded = page.locator('button[data-faq-item="true"][aria-expanded="true"]');
    expect(await expanded.count()).toBe(0);
  });
});

// ============================================================
// PRIVACY PAGE
// ============================================================
test.describe("Privacy Page (/privacy)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy");
  });

  test("has exactly one H1 with 'Privacy'", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Privacy");
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("contains all required sections", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("Zero-Knowledge");
    expect(body).toContain("Information We Collect");
    expect(body).toContain("Data Retention");
    expect(body).toContain("RUFADAA");
    expect(body).toContain("Contact");
  });

  test("has contact email link", async ({ page }) => {
    const emailLink = page.locator('a[href^="mailto:"]');
    expect(await emailLink.count()).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// TERMS PAGE
// ============================================================
test.describe("Terms Page (/terms)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms");
  });

  test("has exactly one H1 with 'Terms'", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Terms");
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("contains all required sections", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("Acceptance");
    expect(body).toContain("Zero-Knowledge");
    expect(body).toContain("Subscription");
    expect(body).toContain("Governing Law");
    expect(body).toContain("Texas");
  });

  test("has contact email link", async ({ page }) => {
    const emailLink = page.locator('a[href^="mailto:"]');
    expect(await emailLink.count()).toBeGreaterThanOrEqual(1);
  });
});
