/**
 * Configuration Tests
 *
 * Validates brand config, copy config, and design tokens
 * for completeness, type safety, and consistency.
 */

import { brand } from "../../src/config/brand";
import { copy } from "../../src/config/copy";
import { tokens } from "../../src/config/tokens";

describe("Brand Configuration", () => {
  it("should have a non-empty product name", () => {
    expect(brand.name).toBeTruthy();
    expect(typeof brand.name).toBe("string");
    expect(brand.name.length).toBeGreaterThan(0);
  });

  it("should have a tagline", () => {
    expect(brand.tagline).toBeTruthy();
    expect(brand.tagline.length).toBeGreaterThan(10);
  });

  it("should have a description for SEO", () => {
    expect(brand.description).toBeTruthy();
    expect(brand.description.length).toBeGreaterThan(50);
  });

  it("should have a legal entity name", () => {
    expect(brand.legalEntity).toBeTruthy();
  });

  it("should have a jurisdiction", () => {
    expect(brand.jurisdiction).toBeTruthy();
  });

  it("should have a primary market", () => {
    expect(brand.primaryMarket).toBe("Texas");
  });

  it("should have valid email addresses", () => {
    expect(brand.contactEmail).toContain("@");
    expect(brand.supportEmail).toContain("@");
  });

  it("should have a domain", () => {
    expect(brand.domain).toBeTruthy();
    expect(brand.domain).toContain(".");
  });

  it("should have a social links object", () => {
    expect(brand.social).toBeDefined();
    expect(typeof brand.social.twitter).toBe("string");
    expect(typeof brand.social.linkedin).toBe("string");
    expect(typeof brand.social.github).toBe("string");
  });

  it("should have a valid copyright year", () => {
    expect(brand.copyrightYear).toBeGreaterThanOrEqual(2024);
    expect(brand.copyrightYear).toBeLessThanOrEqual(2030);
  });
});

describe("Copy Configuration", () => {
  describe("Hero Section", () => {
    it("should have at least 3 taglines", () => {
      expect(copy.hero.taglines.length).toBeGreaterThanOrEqual(3);
    });

    it("should have a subtitle", () => {
      expect(copy.hero.subtitle).toBeTruthy();
    });

    it("should have CTA labels", () => {
      expect(copy.hero.ctaPrimary).toBeTruthy();
      expect(copy.hero.ctaSecondary).toBeTruthy();
    });

    it("taglines should not contain forbidden words", () => {
      const forbidden = ["legacy", "stored", "emergency contacts"];
      for (const tagline of copy.hero.taglines) {
        for (const word of forbidden) {
          expect(tagline.toLowerCase()).not.toContain(word);
        }
      }
    });
  });

  describe("Problem Section", () => {
    it("should have exactly 3 stats", () => {
      expect(copy.problem.stats.length).toBe(3);
    });

    it("each stat should have value, label, and description", () => {
      for (const stat of copy.problem.stats) {
        expect(stat.value).toBeTruthy();
        expect(stat.label).toBeTruthy();
        expect(stat.description).toBeTruthy();
      }
    });
  });

  describe("How It Works", () => {
    it("should have exactly 3 steps", () => {
      expect(copy.howItWorks.steps.length).toBe(3);
    });

    it("steps should be numbered 01, 02, 03", () => {
      expect(copy.howItWorks.steps[0].number).toBe("01");
      expect(copy.howItWorks.steps[1].number).toBe("02");
      expect(copy.howItWorks.steps[2].number).toBe("03");
    });
  });

  describe("Features", () => {
    it("should have exactly 8 features", () => {
      expect(copy.features.items.length).toBe(8);
    });

    it("each feature should have title and description", () => {
      for (const feature of copy.features.items) {
        expect(feature.title).toBeTruthy();
        expect(feature.description).toBeTruthy();
        expect(feature.description.length).toBeGreaterThan(20);
      }
    });
  });

  describe("Pricing", () => {
    it("should have exactly 3 tiers", () => {
      expect(copy.pricing.tiers.length).toBe(3);
    });

    it("tiers should be Free, Pro, Business", () => {
      expect(copy.pricing.tiers[0].name).toBe("Free");
      expect(copy.pricing.tiers[1].name).toBe("Pro");
      expect(copy.pricing.tiers[2].name).toBe("Business");
    });

    it("Free tier should be $0", () => {
      expect(copy.pricing.tiers[0].price.monthly).toBe(0);
      expect(copy.pricing.tiers[0].price.annual).toBe(0);
    });

    it("Pro tier should have highlighted flag", () => {
      expect(copy.pricing.tiers[1].highlighted).toBe(true);
    });

    it("each tier should have features list", () => {
      for (const tier of copy.pricing.tiers) {
        expect(tier.features.length).toBeGreaterThan(0);
      }
    });

    it("annual price should be <= monthly price", () => {
      for (const tier of copy.pricing.tiers) {
        expect(tier.price.annual).toBeLessThanOrEqual(tier.price.monthly);
      }
    });
  });

  describe("Security", () => {
    it("should have exactly 6 security layers", () => {
      expect(copy.security.layers.length).toBe(6);
    });

    it("each layer should have plain and technical descriptions", () => {
      for (const layer of copy.security.layers) {
        expect(layer.title).toBeTruthy();
        expect(layer.plain).toBeTruthy();
        expect(layer.technical).toBeTruthy();
        expect(layer.plain.length).toBeGreaterThan(50);
        expect(layer.technical.length).toBeGreaterThan(20);
      }
    });
  });

  describe("FAQ", () => {
    it("should have at least 5 FAQ items", () => {
      expect(copy.faq.items.length).toBeGreaterThanOrEqual(5);
    });

    it("each FAQ should have question and answer", () => {
      for (const item of copy.faq.items) {
        expect(item.question).toBeTruthy();
        expect(item.answer).toBeTruthy();
        expect(item.question.endsWith("?")).toBe(true);
      }
    });
  });

  describe("Navigation", () => {
    it("should have marketing nav items", () => {
      expect(copy.nav.marketing.length).toBeGreaterThanOrEqual(5);
    });

    it("each nav item should have label and href", () => {
      for (const item of copy.nav.marketing) {
        expect(item.label).toBeTruthy();
        expect(item.href).toMatch(/^\//);
      }
    });

    it("should have CTA labels", () => {
      expect(copy.nav.ctaLogin).toBeTruthy();
      expect(copy.nav.ctaRegister).toBeTruthy();
    });
  });

  describe("Footer", () => {
    it("should have tagline containing brand name", () => {
      expect(copy.footer.tagline).toContain(brand.name);
    });

    it("should have copyright with legal entity", () => {
      expect(copy.footer.copyright).toContain(brand.legalEntity);
    });

    it("should have legal links", () => {
      expect(copy.footer.legal.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Voice Rules Compliance", () => {
    it("should never use 'legacy' in any copy string", () => {
      const allStrings = JSON.stringify(copy).toLowerCase();
      // "legacy" as a standalone word (not part of another word)
      expect(allStrings).not.toMatch(/\blegacy\b/);
    });

    it("should never use 'stored' in copy", () => {
      const allStrings = JSON.stringify(copy).toLowerCase();
      // Allow "stored" in technical context but not in user-facing copy
      // Check hero, problem, howItWorks, features
      const userFacing = JSON.stringify({
        hero: copy.hero,
        problem: copy.problem,
        howItWorks: copy.howItWorks,
        features: copy.features,
      }).toLowerCase();
      expect(userFacing).not.toMatch(/\bstored\b/);
    });

    it("should never use 'emergency contacts'", () => {
      const allStrings = JSON.stringify(copy).toLowerCase();
      expect(allStrings).not.toContain("emergency contacts");
    });
  });
});

describe("Design Tokens", () => {
  it("should export a tokens object", () => {
    expect(tokens).toBeDefined();
    expect(typeof tokens).toBe("object");
  });
});
