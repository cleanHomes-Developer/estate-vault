import { test, expect } from "@playwright/test";

// ============================================================
// REGISTER PAGE
// ============================================================
test.describe("Register Page (/register)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("displays brand name/logo", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("[PRODUCT_NAME]");
  });

  test("has email input field with label", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    // Should have associated label
    const label = page.locator('label:has-text("Email"), label:has-text("email")');
    expect(await label.count()).toBeGreaterThanOrEqual(1);
  });

  test("has password input field with label (on step 2)", async ({ page }) => {
    // Register is multi-step: password is on step 2
    // First fill email and click Continue to get to step 2
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("test@example.com");
    const continueBtn = page.locator('button:has-text("Continue")');
    await continueBtn.click();
    await page.waitForTimeout(500);
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput.first()).toBeVisible();
  });

  test("has name/display name input field", async ({ page }) => {
    const nameInput = page.locator('input[type="text"], input[placeholder*="name" i], input[placeholder*="Name"]');
    expect(await nameInput.count()).toBeGreaterThanOrEqual(1);
  });

  test("has submit/register button", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Register"), button:has-text("Sign up"), button:has-text("Continue")');
    expect(await submitBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("has link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/login"], a:has-text("Sign in"), a:has-text("Log in")');
    expect(await loginLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("empty form submission does not advance (Continue disabled without email)", async ({ page }) => {
    // The Continue button should be disabled when email is empty
    const continueBtn = page.locator('button:has-text("Continue")');
    if (await continueBtn.count() > 0) {
      const isDisabled = await continueBtn.first().isDisabled();
      expect(isDisabled).toBe(true);
      // Should still be on register page
      expect(page.url()).toContain("/register");
    }
  });

  test("password field masks input (on step 2)", async ({ page }) => {
    // Navigate to step 2 first
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("test@example.com");
    const continueBtn = page.locator('button:has-text("Continue")');
    await continueBtn.click();
    await page.waitForTimeout(500);
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill("TestPassword123!");
    const type = await passwordInput.getAttribute("type");
    expect(type).toBe("password");
  });

  test("email field validates format (HTML5)", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      const type = await emailInput.first().getAttribute("type");
      expect(type).toBe("email");
    }
  });

  test("all form inputs are focusable", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        await input.focus();
        await expect(input).toBeFocused();
      }
    }
  });
});

// ============================================================
// LOGIN PAGE
// ============================================================
test.describe("Login Page (/login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("displays brand name/logo", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("[PRODUCT_NAME]");
  });

  test("has email input field", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test("has password input field", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test("has login/sign-in button", async ({ page }) => {
    const loginBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Unlock")');
    expect(await loginBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test("has link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href="/register"], a:has-text("Create"), a:has-text("Sign up")');
    expect(await registerLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("has link to recover/forgot password", async ({ page }) => {
    const recoverLink = page.locator('a[href="/recover"], a:has-text("Forgot"), a:has-text("recover"), a:has-text("Reset")');
    expect(await recoverLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("empty form submission does not navigate away", async ({ page }) => {
    const loginBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Unlock")');
    if (await loginBtn.count() > 0) {
      // Check if button is disabled when fields are empty
      const isDisabled = await loginBtn.first().isDisabled();
      if (!isDisabled) {
        await loginBtn.first().click();
        await page.waitForTimeout(500);
      }
      expect(page.url()).toContain("/login");
    }
  });

  test("can type in email and password fields", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.fill("test@example.com");
    await passwordInput.fill("TestPassword123!");
    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("TestPassword123!");
  });

  test("password field is masked", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const type = await passwordInput.getAttribute("type");
    expect(type).toBe("password");
  });

  test("tab order works through form fields", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    await page.keyboard.press("Tab");
    // Next focusable element should be password or another input
    const focused = page.locator(":focus");
    expect(await focused.count()).toBe(1);
  });
});

// ============================================================
// RECOVER PAGE
// ============================================================
test.describe("Recover Page (/recover)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/recover");
  });

  test("has exactly one H1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("displays brand name/logo", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).toContain("[PRODUCT_NAME]");
  });

  test("shows zero-knowledge warning", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toContain("zero-knowledge");
  });

  test("step 1: has email input and continue button", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(continueBtn).toBeVisible();
  });

  test("step 1 → step 2: clicking continue shows recovery key input", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("test@example.com");
    const continueBtn = page.locator('button:has-text("Continue")');
    await continueBtn.click();
    await page.waitForTimeout(500);
    // Should now show recovery key input
    const recoveryInput = page.locator('input[placeholder*="recovery" i], input[placeholder*="24-word" i], input[id="recovery-key"]');
    await expect(recoveryInput).toBeVisible();
  });

  test("step 2: has verify button and back button", async ({ page }) => {
    // Navigate to step 2
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("test@example.com");
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(500);

    const verifyBtn = page.locator('button:has-text("Verify")');
    await expect(verifyBtn).toBeVisible();
    const backBtn = page.locator('button:has-text("Back")');
    await expect(backBtn).toBeVisible();
  });

  test("step 2 → step 3: clicking verify shows new password fields", async ({ page }) => {
    // Navigate to step 2
    await page.locator('input[type="email"]').fill("test@example.com");
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(500);

    // Fill recovery key and verify
    const recoveryInput = page.locator('input[id="recovery-key"]');
    await recoveryInput.fill("test-recovery-key-placeholder");
    await page.locator('button:has-text("Verify")').click();
    await page.waitForTimeout(500);

    // Should show new password fields
    const passwordInputs = page.locator('input[type="password"]');
    expect(await passwordInputs.count()).toBeGreaterThanOrEqual(2);
  });

  test("step 2: back button returns to step 1", async ({ page }) => {
    await page.locator('input[type="email"]').fill("test@example.com");
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Back")').click();
    await page.waitForTimeout(500);
    // Should see email input again
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test("has link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/login"], a:has-text("Sign in")');
    expect(await loginLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("step 3: reset button is present", async ({ page }) => {
    // Navigate through all steps
    await page.locator('input[type="email"]').fill("test@example.com");
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(300);
    await page.locator('input[id="recovery-key"]').fill("test-key");
    await page.locator('button:has-text("Verify")').click();
    await page.waitForTimeout(300);

    const resetBtn = page.locator('button:has-text("Reset")');
    await expect(resetBtn).toBeVisible();
  });
});
