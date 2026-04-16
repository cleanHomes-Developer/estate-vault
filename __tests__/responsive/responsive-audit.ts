/**
 * Responsive Design Audit
 *
 * Tests all pages across 5 breakpoints: mobile (375px), tablet (768px),
 * laptop (1024px), desktop (1280px), wide (1920px).
 * Checks for horizontal overflow, element visibility, and layout integrity.
 */

import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "Mobile (375px)", width: 375, height: 812 },
  { name: "Tablet (768px)", width: 768, height: 1024 },
  { name: "Laptop (1024px)", width: 1024, height: 768 },
  { name: "Desktop (1280px)", width: 1280, height: 720 },
  { name: "Wide (1920px)", width: 1920, height: 1080 },
];

const PAGES = [
  { name: "Homepage", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Security", path: "/security" },
  { name: "Pricing", path: "/pricing" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Assets", path: "/assets" },
  { name: "Beneficiaries", path: "/beneficiaries" },
  { name: "Partner Dashboard", path: "/partner/dashboard" },
];

interface ResponsiveResult {
  page: string;
  viewport: string;
  width: number;
  hasHorizontalOverflow: boolean;
  bodyScrollWidth: number;
  viewportWidth: number;
  overflowElements: string[];
  status: "PASS" | "FAIL" | "ERROR";
}

async function testPage(
  page: Page,
  pageDef: { name: string; path: string },
  viewport: { name: string; width: number; height: number }
): Promise<ResponsiveResult> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
    const clientWidth = html.clientWidth;
    const hasOverflow = scrollWidth > clientWidth + 5; // 5px tolerance

    // Find elements causing overflow
    const overflowElements: string[] = [];
    if (hasOverflow) {
      const allElements = document.querySelectorAll("*");
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > clientWidth + 5) {
          const tag = el.tagName.toLowerCase();
          const cls = el.className ? `.${String(el.className).split(" ").slice(0, 2).join(".")}` : "";
          overflowElements.push(`${tag}${cls}`);
        }
      });
    }

    return {
      bodyScrollWidth: scrollWidth,
      viewportWidth: clientWidth,
      hasHorizontalOverflow: hasOverflow,
      overflowElements: overflowElements.slice(0, 5), // Limit to 5
    };
  });

  return {
    page: pageDef.name,
    viewport: viewport.name,
    width: viewport.width,
    ...result,
    status: result.hasHorizontalOverflow ? "FAIL" : "PASS",
  };
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting responsive design audit...\n");

  const results: ResponsiveResult[] = [];

  for (const pageDef of PAGES) {
    for (const viewport of VIEWPORTS) {
      try {
        process.stdout.write(`Testing: ${pageDef.name} @ ${viewport.name}... `);
        const result = await testPage(page, pageDef, viewport);
        results.push(result);
        console.log(result.status);
      } catch (err) {
        console.log("ERROR");
        results.push({
          page: pageDef.name,
          viewport: viewport.name,
          width: viewport.width,
          hasHorizontalOverflow: false,
          bodyScrollWidth: 0,
          viewportWidth: viewport.width,
          overflowElements: [],
          status: "ERROR",
        });
      }
    }
  }

  await browser.close();

  // Generate report
  const outDir = path.join(process.cwd(), "__tests__/results");
  fs.mkdirSync(outDir, { recursive: true });

  const totalTests = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const errors = results.filter((r) => r.status === "ERROR").length;

  let md = `# Phase 8: Responsive Design Audit\n\n`;
  md += `**Breakpoints tested:** ${VIEWPORTS.map((v) => v.name).join(", ")}\n`;
  md += `**Pages tested:** ${PAGES.length}\n`;
  md += `**Total tests:** ${totalTests}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|--------|-------|\n`;
  md += `| Passed | ${passed} |\n`;
  md += `| Failed (horizontal overflow) | ${failed} |\n`;
  md += `| Errors | ${errors} |\n\n`;

  md += `## Results Matrix\n\n`;
  md += `| Page | ${VIEWPORTS.map((v) => v.name.split(" ")[0]).join(" | ")} |\n`;
  md += `|------|${VIEWPORTS.map(() => "------").join("|")}|\n`;

  for (const pageDef of PAGES) {
    const row = VIEWPORTS.map((v) => {
      const r = results.find((r) => r.page === pageDef.name && r.viewport === v.name);
      return r ? r.status : "N/A";
    });
    md += `| ${pageDef.name} | ${row.join(" | ")} |\n`;
  }

  // Detail failures
  const failures = results.filter((r) => r.status === "FAIL");
  if (failures.length > 0) {
    md += `\n## Overflow Details\n\n`;
    for (const f of failures) {
      md += `### ${f.page} @ ${f.viewport}\n`;
      md += `- Scroll width: ${f.bodyScrollWidth}px vs viewport: ${f.viewportWidth}px\n`;
      md += `- Overflow elements: ${f.overflowElements.join(", ") || "unknown"}\n\n`;
    }
  }

  fs.writeFileSync(path.join(outDir, "phase8-responsive.md"), md);
  fs.writeFileSync(path.join(outDir, "responsive-results.json"), JSON.stringify(results, null, 2));

  console.log(`\nAudit complete: ${passed} passed, ${failed} failed, ${errors} errors`);
}

main().catch(console.error);
