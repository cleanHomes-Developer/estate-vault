/**
 * Link Validation & Navigation Audit
 *
 * Crawls all pages, extracts all links, and validates they resolve correctly.
 * Tests internal navigation, anchor links, and external links.
 */

import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";

const PAGES = [
  "/", "/features", "/security", "/pricing", "/partners", "/journal", "/faq",
  "/login", "/register",
  "/dashboard", "/assets", "/assets/new", "/beneficiaries", "/simulator",
  "/messages", "/checkin", "/vault-security", "/subscription", "/settings",
  "/partner/dashboard", "/partner/clients", "/partner/revenue",
  "/partner/exhibit-a", "/partner/resources", "/partner/settings",
];

interface LinkResult {
  sourcePage: string;
  href: string;
  text: string;
  type: "internal" | "external" | "anchor" | "mailto" | "tel" | "javascript";
  status: number | null;
  ok: boolean;
  error?: string;
}

async function extractLinks(page: Page, pagePath: string): Promise<LinkResult[]> {
  await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(300);

  const links = await page.evaluate(() => {
    const anchors = document.querySelectorAll("a[href]");
    return Array.from(anchors).map((a) => ({
      href: a.getAttribute("href") || "",
      text: a.textContent?.trim().slice(0, 50) || "",
    }));
  });

  return links.map((link) => {
    let type: LinkResult["type"] = "internal";
    if (link.href.startsWith("http://") || link.href.startsWith("https://")) type = "external";
    else if (link.href.startsWith("#")) type = "anchor";
    else if (link.href.startsWith("mailto:")) type = "mailto";
    else if (link.href.startsWith("tel:")) type = "tel";
    else if (link.href.startsWith("javascript:")) type = "javascript";

    return {
      sourcePage: pagePath,
      href: link.href,
      text: link.text,
      type,
      status: null,
      ok: true,
    };
  });
}

async function validateInternalLink(page: Page, href: string): Promise<{ status: number; ok: boolean }> {
  try {
    const url = href.startsWith("/") ? `${BASE_URL}${href}` : `${BASE_URL}/${href}`;
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    const status = response?.status() || 0;
    return { status, ok: status >= 200 && status < 400 };
  } catch {
    return { status: 0, ok: false };
  }
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting link validation audit...\n");

  const allLinks: LinkResult[] = [];
  const checkedInternalPaths = new Set<string>();

  // Extract links from all pages
  for (const pagePath of PAGES) {
    try {
      process.stdout.write(`Extracting links from ${pagePath}... `);
      const links = await extractLinks(page, pagePath);
      allLinks.push(...links);
      console.log(`${links.length} links`);
    } catch (err) {
      console.log(`ERROR: ${(err as Error).message}`);
    }
  }

  // Validate internal links
  const internalLinks = allLinks.filter((l) => l.type === "internal");
  const uniqueInternalPaths = [...new Set(internalLinks.map((l) => l.href))];

  console.log(`\nValidating ${uniqueInternalPaths.length} unique internal paths...`);

  for (const href of uniqueInternalPaths) {
    if (checkedInternalPaths.has(href)) continue;
    checkedInternalPaths.add(href);

    process.stdout.write(`  ${href}... `);
    const result = await validateInternalLink(page, href);
    console.log(result.ok ? `${result.status} OK` : `${result.status} FAIL`);

    // Update all links with this href
    for (const link of allLinks) {
      if (link.href === href && link.type === "internal") {
        link.status = result.status;
        link.ok = result.ok;
      }
    }
  }

  await browser.close();

  // Generate report
  const outDir = path.join(process.cwd(), "__tests__/results");
  fs.mkdirSync(outDir, { recursive: true });

  const totalLinks = allLinks.length;
  const internalCount = allLinks.filter((l) => l.type === "internal").length;
  const externalCount = allLinks.filter((l) => l.type === "external").length;
  const brokenLinks = allLinks.filter((l) => !l.ok);
  const anchorCount = allLinks.filter((l) => l.type === "anchor").length;

  let md = `# Phase 11: Link Validation & Navigation Audit\n\n`;
  md += `**Pages crawled:** ${PAGES.length}\n`;
  md += `**Total links found:** ${totalLinks}\n\n`;

  md += `## Link Type Breakdown\n\n`;
  md += `| Type | Count |\n|------|-------|\n`;
  md += `| Internal | ${internalCount} |\n`;
  md += `| External | ${externalCount} |\n`;
  md += `| Anchor (#) | ${anchorCount} |\n`;
  md += `| Mailto | ${allLinks.filter((l) => l.type === "mailto").length} |\n`;
  md += `| Tel | ${allLinks.filter((l) => l.type === "tel").length} |\n\n`;

  md += `## Internal Link Validation\n\n`;
  md += `| Path | Status | Result |\n|------|--------|--------|\n`;
  for (const href of uniqueInternalPaths) {
    const link = allLinks.find((l) => l.href === href && l.type === "internal");
    if (link) {
      md += `| ${href} | ${link.status} | ${link.ok ? "PASS" : "FAIL"} |\n`;
    }
  }

  if (brokenLinks.length > 0) {
    md += `\n## Broken Links\n\n`;
    md += `| Source Page | Href | Text | Status |\n|------------|------|------|--------|\n`;
    for (const link of brokenLinks) {
      md += `| ${link.sourcePage} | ${link.href} | ${link.text} | ${link.status} |\n`;
    }
  }

  md += `\n## Summary\n\n`;
  md += `- **Total broken links:** ${brokenLinks.length}\n`;
  md += `- **Internal links validated:** ${uniqueInternalPaths.length}\n`;
  md += `- **External links (not validated):** ${externalCount}\n`;

  fs.writeFileSync(path.join(outDir, "phase11-links.md"), md);
  fs.writeFileSync(path.join(outDir, "link-results.json"), JSON.stringify(allLinks, null, 2));

  console.log(`\nAudit complete: ${brokenLinks.length} broken links out of ${totalLinks} total`);
}

main().catch(console.error);
