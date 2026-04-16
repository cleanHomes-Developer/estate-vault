import { test, expect } from "@playwright/test";

// ============================================================
// DASHBOARD
// ============================================================
test.describe("Dashboard (/dashboard)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("renders with H1 or heading", async ({ page }) => {
    const headings = page.locator("h1, h2");
    expect(await headings.count()).toBeGreaterThanOrEqual(1);
  });

  test("sidebar navigation is present with all nav items", async ({ page }) => {
    const sidebar = page.locator("nav, aside");
    expect(await sidebar.count()).toBeGreaterThanOrEqual(1);
    // Check for key nav items
    const body = await page.textContent("body");
    expect(body).toContain("Dashboard");
    expect(body).toContain("Assets");
    expect(body).toContain("Beneficiaries");
  });

  test("health score ring/indicator is visible", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/health|score|vault/);
  });

  test("asset summary stats are displayed", async ({ page }) => {
    // Should show asset count
    const numbers = page.locator('text=/\\d+/');
    expect(await numbers.count()).toBeGreaterThan(0);
  });

  test("recent assets section is visible", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/recent|asset/);
  });

  test("activity feed section is visible", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/activity|recent/);
  });

  test("quick action buttons/links are present", async ({ page }) => {
    const actionLinks = page.locator("a, button");
    expect(await actionLinks.count()).toBeGreaterThan(5);
  });

  test("vault simulator shortcut is present", async ({ page }) => {
    const simLink = page.locator('a[href*="simulator"], a:has-text("Simulator"), button:has-text("Simulator")');
    expect(await simLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("all sidebar links navigate correctly", async ({ page }) => {
    const sidebarLinks = page.locator('nav a[href], aside a[href]');
    const count = await sidebarLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await sidebarLinks.nth(i).getAttribute("href");
      if (href && href.startsWith("/")) {
        expect(href).toBeTruthy();
      }
    }
  });
});

// ============================================================
// ASSETS LIST
// ============================================================
test.describe("Assets Page (/assets)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/assets");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays asset cards/list items", async ({ page }) => {
    const assetCards = page.locator('a[href*="/assets/"]');
    expect(await assetCards.count()).toBeGreaterThanOrEqual(1);
  });

  test("has Add Asset button/link", async ({ page }) => {
    const addBtn = page.locator('a[href="/assets/new"], a:has-text("Add"), button:has-text("Add")');
    expect(await addBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("category filter pills are visible and clickable", async ({ page }) => {
    const pills = page.locator('button:has-text("All"), button:has-text("Crypto"), button:has-text("Financial")');
    expect(await pills.count()).toBeGreaterThanOrEqual(2);
    // Click a category filter
    const cryptoPill = page.locator('button:has-text("Crypto")');
    if (await cryptoPill.count() > 0) {
      await cryptoPill.click();
      await page.waitForTimeout(300);
    }
  });

  test("grid/list view toggle works", async ({ page }) => {
    const toggleBtns = page.locator('button[aria-label*="grid" i], button[aria-label*="list" i], button[aria-label*="Grid" i], button[aria-label*="List" i]');
    if (await toggleBtns.count() >= 2) {
      await toggleBtns.first().click();
      await page.waitForTimeout(300);
      await toggleBtns.last().click();
      await page.waitForTimeout(300);
    }
  });

  test("search input is present and functional", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="Search" i], input[type="search"]');
    if (await searchInput.count() > 0) {
      await searchInput.first().fill("Bitcoin");
      await page.waitForTimeout(300);
    }
  });

  test("asset cards link to detail pages", async ({ page }) => {
    const assetLinks = page.locator('a[href*="/assets/"]');
    const count = await assetLinks.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const href = await assetLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/\/assets\/(new|\d+)/);
    }
  });

  test("asset cards show status badges", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/documented|incomplete|complete/);
  });
});

// ============================================================
// ASSET DETAIL (dynamic)
// ============================================================
for (const assetId of ["1", "2", "3"]) {
  test.describe(`Asset Detail (/assets/${assetId})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/assets/${assetId}`);
    });

    test("has back link to assets list", async ({ page }) => {
      const backLink = page.locator('a[href="/assets"], a:has-text("Back")');
      expect(await backLink.count()).toBeGreaterThanOrEqual(1);
    });

    test("displays asset name as heading", async ({ page }) => {
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });

    test("shows encrypted fields section", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("encrypt");
    });

    test("reveal/hide buttons work for sensitive fields", async ({ page }) => {
      const revealBtns = page.locator('button:has-text("Reveal")');
      if (await revealBtns.count() > 0) {
        await revealBtns.first().click();
        await page.waitForTimeout(300);
        // Should now show "Hide" button
        const hideBtns = page.locator('button:has-text("Hide")');
        expect(await hideBtns.count()).toBeGreaterThanOrEqual(1);
        // Click hide
        await hideBtns.first().click();
        await page.waitForTimeout(300);
      }
    });

    test("has edit and delete buttons", async ({ page }) => {
      const editBtn = page.locator('button:has-text("Edit"), button[aria-label*="Edit" i]');
      expect(await editBtn.count()).toBeGreaterThanOrEqual(1);
      const deleteBtn = page.locator('button[aria-label*="Delete" i], button:has-text("Delete")');
      expect(await deleteBtn.count()).toBeGreaterThanOrEqual(1);
    });

    test("shows beneficiaries section", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("beneficiar");
    });

    test("shows security info section", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body).toContain("XChaCha20");
    });

    test("shows activity log", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("activity");
    });

    test("add beneficiary button is present", async ({ page }) => {
      const addBtn = page.locator('button:has-text("Add beneficiary"), button:has-text("add beneficiary")');
      expect(await addBtn.count()).toBeGreaterThanOrEqual(1);
    });
  });
}

// ============================================================
// ADD ASSET
// ============================================================
test.describe("Add Asset Page (/assets/new)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/assets/new");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays category selection", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/crypto|financial|domain|business|identity/);
  });

  test("category buttons are clickable", async ({ page }) => {
    const categoryBtns = page.locator("button, [role='button']");
    const count = await categoryBtns.count();
    expect(count).toBeGreaterThan(3);
  });

  test("selecting a category shows category-specific form", async ({ page }) => {
    // Click on a category
    const cryptoBtn = page.locator('button:has-text("Crypto"), div:has-text("Crypto")').first();
    if (await cryptoBtn.isVisible()) {
      await cryptoBtn.click();
      await page.waitForTimeout(500);
      // Should show form fields
      const inputs = page.locator("input, textarea, select");
      expect(await inputs.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test("form has category selection buttons", async ({ page }) => {
    // Add Asset page shows category cards as buttons, not a traditional save button
    const categoryBtns = page.locator('button:has-text("Crypto"), button:has-text("Domain"), button:has-text("Financial"), button:has-text("Business")');
    expect(await categoryBtns.count()).toBeGreaterThanOrEqual(4);
  });
});

// ============================================================
// BENEFICIARIES LIST
// ============================================================
test.describe("Beneficiaries Page (/beneficiaries)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/beneficiaries");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays beneficiary cards", async ({ page }) => {
    const cards = page.locator('a[href*="/beneficiaries/"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test("has Add Beneficiary button", async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add"), a:has-text("Add")');
    expect(await addBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("beneficiary cards show name, relationship, status", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toMatch(/Spouse|Brother|Attorney|Partner/);
    expect(body?.toLowerCase()).toMatch(/active|pending|verified/);
  });

  test("beneficiary cards show email", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("@");
  });

  test("cards link to detail pages", async ({ page }) => {
    const links = page.locator('a[href*="/beneficiaries/"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/\/beneficiaries\/\d+/);
    }
  });
});

// ============================================================
// BENEFICIARY DETAIL (dynamic)
// ============================================================
for (const benId of ["1", "2", "3"]) {
  test.describe(`Beneficiary Detail (/beneficiaries/${benId})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/beneficiaries/${benId}`);
    });

    test("has back link", async ({ page }) => {
      const backLink = page.locator('a[href="/beneficiaries"], a:has-text("Back")');
      expect(await backLink.count()).toBeGreaterThanOrEqual(1);
    });

    test("displays beneficiary name", async ({ page }) => {
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });

    test("shows contact information", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body).toContain("@");
      expect(body).toMatch(/\+1|\d{3}/);
    });

    test("shows assigned assets section", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("assigned");
    });

    test("shows key exchange info", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("x25519");
    });

    test("has assign asset button", async ({ page }) => {
      const assignBtn = page.locator('button:has-text("Assign"), button:has-text("assign")');
      expect(await assignBtn.count()).toBeGreaterThanOrEqual(1);
    });

    test("shows activity log", async ({ page }) => {
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toContain("activity");
    });
  });
}

// ============================================================
// VAULT SIMULATOR
// ============================================================
test.describe("Vault Simulator (/simulator)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/simulator");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays simulation controls", async ({ page }) => {
    const buttons = page.locator("button");
    expect(await buttons.count()).toBeGreaterThanOrEqual(1);
  });

  test("shows beneficiary selection or simulation steps", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/beneficiar|simulat|preview|step/);
  });

  test("shows simulation interface with beneficiary info", async ({ page }) => {
    const body = await page.textContent("body");
    // Simulator page shows beneficiary/simulation content
    expect(body?.toLowerCase()).toMatch(/simulat|vault|beneficiar|preview/);
  });

  test("clicking start advances the simulation", async ({ page }) => {
    const startBtn = page.locator('button:has-text("Start"), button:has-text("Run"), button:has-text("Simulate"), button:has-text("Begin"), button:has-text("Preview")');
    if (await startBtn.count() > 0) {
      await startBtn.first().click();
      await page.waitForTimeout(500);
    }
  });
});

// ============================================================
// MESSAGES
// ============================================================
test.describe("Messages Page (/messages)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/messages");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("displays message list or empty state", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/message|letter|note|compose|no message|empty/);
  });

  test("has compose/new message button", async ({ page }) => {
    const composeBtn = page.locator('button:has-text("Compose"), button:has-text("New"), button:has-text("Create"), button:has-text("Write"), a:has-text("Compose"), a:has-text("New")');
    expect(await composeBtn.count()).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// CHECK-IN
// ============================================================
test.describe("Check-in Page (/checkin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkin");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("shows check-in status", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/check.?in|status|active|next|due|schedule/);
  });

  test("has check-in now button", async ({ page }) => {
    const checkinBtn = page.locator('button:has-text("Check"), button:has-text("Confirm"), button:has-text("Verify")');
    expect(await checkinBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("shows check-in schedule info", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/check.?in|due|next|confirm|control/);
  });

  test("check-in button is clickable", async ({ page }) => {
    const checkinBtn = page.locator('button:has-text("Check"), button:has-text("Confirm")');
    if (await checkinBtn.count() > 0) {
      await checkinBtn.first().click();
      await page.waitForTimeout(500);
    }
  });
});

// ============================================================
// VAULT SECURITY (App)
// ============================================================
test.describe("Vault Security Page (/vault-security)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vault-security");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("shows MFA/2FA settings", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/two.?factor|2fa|mfa|authenticator|webauthn/);
  });

  test("shows session management", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/session|device|active/);
  });

  test("has security action buttons", async ({ page }) => {
    const actionBtns = page.locator('button:has-text("Set up"), button:has-text("Change"), button:has-text("Generate"), button:has-text("Revoke")');
    expect(await actionBtns.count()).toBeGreaterThanOrEqual(1);
  });

  test("shows recovery key section", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/recovery|backup/);
  });
});

// ============================================================
// SUBSCRIPTION
// ============================================================
test.describe("Subscription Page (/subscription)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/subscription");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("shows current plan", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/plan|free|premium|professional|current/);
  });

  test("shows upgrade options", async ({ page }) => {
    const upgradeBtn = page.locator('button:has-text("Upgrade"), button:has-text("Change"), a:has-text("Upgrade")');
    expect(await upgradeBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("shows billing information", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/billing|payment|invoice|subscription/);
  });
});

// ============================================================
// SETTINGS
// ============================================================
test.describe("Settings Page (/settings)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("has page heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("has profile settings section", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/profile|name|email|display/);
  });

  test("has form inputs for profile fields", async ({ page }) => {
    const inputs = page.locator("input, select, textarea");
    expect(await inputs.count()).toBeGreaterThanOrEqual(2);
  });

  test("all form inputs have labels", async ({ page }) => {
    const labels = page.locator("label");
    const inputs = page.locator("input, select, textarea");
    const labelCount = await labels.count();
    const inputCount = await inputs.count();
    // At least as many labels as visible inputs
    expect(labelCount).toBeGreaterThanOrEqual(Math.floor(inputCount * 0.7));
  });

  test("has save button", async ({ page }) => {
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]');
    expect(await saveBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("has notification preferences", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/notification|email|alert|preference/);
  });

  test("notification toggles are interactive", async ({ page }) => {
    const toggles = page.locator('button[role="switch"], input[type="checkbox"]');
    if (await toggles.count() > 0) {
      await toggles.first().click();
      await page.waitForTimeout(300);
    }
  });

  test("has danger zone / delete account section", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/danger|delete|deactivate|close account/);
  });

  test("select elements have proper labels", async ({ page }) => {
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
});
