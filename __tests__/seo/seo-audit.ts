/**
 * SEO & Metadata Validation Audit
 *
 * Checks every marketing page for proper meta tags, headings,
 * Open Graph, semantic HTML, and SEO best practices.
 */

import { chromium, Browser, Page } from "playwright";
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
  { name: "Beneficiaries", path: "/beneficiaries" },
  { name: "Partner Dashboard", path: "/partner/dashboard" },
];

interface SEOResult {
  page: string;
  path: string;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonical: string | null;
  h1Count: number;
  h1Text: string[];
  hasViewport: boolean;
  hasCharset: boolean;
  hasLang: boolean;
  headingHierarchy: string[];
  issues: string[];
}

async function auditPage(page: Page, pageDef: { name: string; path: string }): Promise<SEOResult> {
  await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(500);

  const pageName = pageDef.name;
  return await page.evaluate(({ pagePath, pageName }) => {
    const issues: string[] = [];

    // Title
    const title = document.title || null;
    if (!title) issues.push("Missing <title> tag");
    else if (title.length < 10) issues.push(`Title too short: "${title}"`);
    else if (title.length > 70) issues.push(`Title too long (${title.length} chars)`);

    // Meta description
    const descMeta = document.querySelector('meta[name="description"]');
    const description = descMeta?.getAttribute("content") || null;
    if (!description) issues.push("Missing meta description");
    else if (description.length < 50) issues.push(`Meta description too short (${description.length} chars)`);
    else if (description.length > 160) issues.push(`Meta description too long (${description.length} chars)`);

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") || null;
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content") || null;
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || null;
    if (!ogTitle) issues.push("Missing og:title");
    if (!ogDescription) issues.push("Missing og:description");
    if (!ogImage) issues.push("Missing og:image");

    // Canonical
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null;
    if (!canonical) issues.push("Missing canonical URL");

    // H1
    const h1Elements = document.querySelectorAll("h1");
    const h1Count = h1Elements.length;
    const h1Text = Array.from(h1Elements).map((el) => el.textContent?.trim() || "");
    if (h1Count === 0) issues.push("Missing H1 heading");
    if (h1Count > 1) issues.push(`Multiple H1 headings (${h1Count})`);

    // Heading hierarchy
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headingHierarchy = Array.from(headings).slice(0, 10).map((el) => {
      return `${el.tagName}: ${el.textContent?.trim().slice(0, 50)}`;
    });

    // Check heading order (no skipping levels)
    let lastLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.tagName[1]);
      if (level > lastLevel + 1 && lastLevel > 0) {
        issues.push(`Heading hierarchy skip: H${lastLevel} → H${level}`);
        break;
      }
      lastLevel = level;
    }

    // Viewport
    const hasViewport = !!document.querySelector('meta[name="viewport"]');
    if (!hasViewport) issues.push("Missing viewport meta tag");

    // Charset
    const hasCharset = !!document.querySelector('meta[charset]');
    if (!hasCharset) issues.push("Missing charset meta tag");

    // Lang
    const hasLang = !!document.documentElement.getAttribute("lang");
    if (!hasLang) issues.push("Missing lang attribute on <html>");

    // Images without alt
    const imgsWithoutAlt = document.querySelectorAll("img:not([alt])");
    if (imgsWithoutAlt.length > 0) {
      issues.push(`${imgsWithoutAlt.length} images missing alt attribute`);
    }

    return {
      page: pageName,
      path: pagePath,
      title,
      description,
      ogTitle,
      ogDescription,
      ogImage,
      canonical,
      h1Count,
      h1Text,
      hasViewport,
      hasCharset,
      hasLang,
      headingHierarchy,
      issues,
    };
  }, { pagePath: pageDef.path, pageName: pageDef.name });
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting SEO audit...\n");
  const results: SEOResult[] = [];

  for (const pageDef of PAGES) {
    try {
      console.log(`Auditing: ${pageDef.name} (${pageDef.path})`);
      const result = await auditPage(page, pageDef);
      results.push(result);
      console.log(`  → ${result.issues.length} issues`);
    } catch (err) {
      console.error(`  → ERROR: ${(err as Error).message}`);
    }
  }

  await browser.close();

  // Generate report
  const outDir = path.join(process.cwd(), "__tests__/results");
  fs.mkdirSync(outDir, { recursive: true });

  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const pagesWithIssues = results.filter((r) => r.issues.length > 0).length;

  let md = `# Phase 10: SEO & Metadata Audit\n\n`;
  md += `**Pages audited:** ${results.length}\n`;
  md += `**Total issues:** ${totalIssues}\n`;
  md += `**Pages with issues:** ${pagesWithIssues}\n\n`;

  md += `## Summary Table\n\n`;
  md += `| Page | Title | Description | OG Tags | H1 | Canonical | Issues |\n`;
  md += `|------|-------|-------------|---------|-----|-----------|--------|\n`;
  for (const r of results) {
    md += `| ${r.page} | ${r.title ? "YES" : "NO"} | ${r.description ? "YES" : "NO"} | ${r.ogTitle ? "YES" : "NO"} | ${r.h1Count} | ${r.canonical ? "YES" : "NO"} | ${r.issues.length} |\n`;
  }

  md += `\n## Detailed Issues\n\n`;
  for (const r of results) {
    if (r.issues.length > 0) {
      md += `### ${r.page} (${r.path})\n`;
      for (const issue of r.issues) {
        md += `- ${issue}\n`;
      }
      md += `\n`;
    }
  }

  md += `## Global Checks\n\n`;
  md += `| Check | Status |\n|-------|--------|\n`;
  md += `| Viewport meta | ${results.every((r) => r.hasViewport) ? "PASS" : "FAIL"} |\n`;
  md += `| Charset meta | ${results.every((r) => r.hasCharset) ? "PASS" : "FAIL"} |\n`;
  md += `| Lang attribute | ${results.every((r) => r.hasLang) ? "PASS" : "FAIL"} |\n`;

  fs.writeFileSync(path.join(outDir, "phase10-seo.md"), md);
  fs.writeFileSync(path.join(outDir, "seo-results.json"), JSON.stringify(results, null, 2));

  console.log(`\nAudit complete: ${totalIssues} issues across ${pagesWithIssues} pages`);
}

main().catch(console.error);
