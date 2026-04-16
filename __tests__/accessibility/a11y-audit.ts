/**
 * Accessibility Audit Script
 *
 * Uses Playwright + axe-core to audit every page for WCAG 2.1 AA compliance.
 * Outputs results to a JSON and Markdown report.
 */

import { chromium, Browser, Page } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";

const PAGES = [
  { name: "Homepage", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Security", path: "/security" },
  { name: "Pricing", path: "/pricing" },
  { name: "Partners", path: "/partners" },
  { name: "Journal", path: "/journal" },
  { name: "FAQ", path: "/faq" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Assets", path: "/assets" },
  { name: "Add Asset", path: "/assets/new" },
  { name: "Beneficiaries", path: "/beneficiaries" },
  { name: "Simulator", path: "/simulator" },
  { name: "Messages", path: "/messages" },
  { name: "Check-in", path: "/checkin" },
  { name: "Vault Security", path: "/vault-security" },
  { name: "Subscription", path: "/subscription" },
  { name: "Settings", path: "/settings" },
  { name: "Partner Dashboard", path: "/partner/dashboard" },
  { name: "Partner Clients", path: "/partner/clients" },
  { name: "Partner Revenue", path: "/partner/revenue" },
  { name: "Exhibit A", path: "/partner/exhibit-a" },
  { name: "Partner Resources", path: "/partner/resources" },
  { name: "Partner Settings", path: "/partner/settings" },
];

interface PageResult {
  name: string;
  path: string;
  violations: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  details: Array<{
    id: string;
    impact: string;
    description: string;
    helpUrl: string;
    nodes: number;
  }>;
}

async function auditPage(page: Page, pageDef: { name: string; path: string }): Promise<PageResult> {
  await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: "networkidle", timeout: 15000 });
  // Wait a bit for client-side rendering
  await page.waitForTimeout(1000);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const details = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact || "unknown",
    description: v.description,
    helpUrl: v.helpUrl,
    nodes: v.nodes.length,
  }));

  return {
    name: pageDef.name,
    path: pageDef.path,
    violations: results.violations.length,
    critical: details.filter((d) => d.impact === "critical").length,
    serious: details.filter((d) => d.impact === "serious").length,
    moderate: details.filter((d) => d.impact === "moderate").length,
    minor: details.filter((d) => d.impact === "minor").length,
    details,
  };
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  console.log("Starting accessibility audit...\n");

  const results: PageResult[] = [];

  for (const pageDef of PAGES) {
    try {
      console.log(`Auditing: ${pageDef.name} (${pageDef.path})`);
      const result = await auditPage(page, pageDef);
      results.push(result);
      console.log(`  → ${result.violations} violations (${result.critical} critical, ${result.serious} serious)`);
    } catch (err) {
      console.error(`  → ERROR: ${(err as Error).message}`);
      results.push({
        name: pageDef.name,
        path: pageDef.path,
        violations: -1,
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0,
        details: [],
      });
    }
  }

  await browser.close();

  // Write JSON results
  const outDir = path.join(process.cwd(), "__tests__/results");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "a11y-results.json"),
    JSON.stringify(results, null, 2)
  );

  // Write Markdown report
  const totalViolations = results.reduce((sum, r) => sum + Math.max(r.violations, 0), 0);
  const totalCritical = results.reduce((sum, r) => sum + r.critical, 0);
  const totalSerious = results.reduce((sum, r) => sum + r.serious, 0);

  let md = `# Phase 7: Accessibility Audit (WCAG 2.1 AA)\n\n`;
  md += `**Tool:** axe-core via Playwright\n`;
  md += `**Standard:** WCAG 2.1 Level AA\n`;
  md += `**Pages audited:** ${results.length}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|--------|-------|\n`;
  md += `| Total violations | ${totalViolations} |\n`;
  md += `| Critical | ${totalCritical} |\n`;
  md += `| Serious | ${totalSerious} |\n`;
  md += `| Pages with zero violations | ${results.filter((r) => r.violations === 0).length} |\n\n`;

  md += `## Per-Page Results\n\n`;
  md += `| Page | Path | Violations | Critical | Serious | Moderate | Minor |\n`;
  md += `|------|------|------------|----------|---------|----------|-------|\n`;
  for (const r of results) {
    md += `| ${r.name} | ${r.path} | ${r.violations} | ${r.critical} | ${r.serious} | ${r.moderate} | ${r.minor} |\n`;
  }

  // Detail section for pages with violations
  const pagesWithViolations = results.filter((r) => r.violations > 0);
  if (pagesWithViolations.length > 0) {
    md += `\n## Violation Details\n\n`;
    for (const r of pagesWithViolations) {
      md += `### ${r.name} (${r.path})\n\n`;
      for (const d of r.details) {
        md += `- **[${d.impact.toUpperCase()}]** ${d.id}: ${d.description} (${d.nodes} elements) — [docs](${d.helpUrl})\n`;
      }
      md += `\n`;
    }
  }

  fs.writeFileSync(path.join(outDir, "phase7-accessibility.md"), md);
  console.log(`\nAudit complete. Total violations: ${totalViolations} (${totalCritical} critical, ${totalSerious} serious)`);
  console.log(`Reports saved to __tests__/results/`);
}

main().catch(console.error);
