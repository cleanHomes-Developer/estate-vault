/**
 * Brand Configuration — Single Source of Truth
 *
 * When the product name is finalised, update ONLY this file.
 * Every component, page, and metadata reference imports from here.
 *
 * Find-and-replace is NOT required; just change the values below.
 */

export const brand = {
  /** The product name displayed across the entire application */
  name: "[PRODUCT_NAME]",

  /** Tagline used in the hero and metadata */
  tagline: "Your digital estate, documented and protected.",

  /** Short description for SEO and social cards */
  description:
    "A private vault that helps you document your digital assets and pass them on to trusted people through a controlled, cryptographically-enforced process.",

  /** Legal entity name */
  legalEntity: "[PRODUCT_NAME], Inc.",

  /** Jurisdiction */
  jurisdiction: "Delaware C-Corp",

  /** Primary market */
  primaryMarket: "Texas",

  /** Contact email */
  contactEmail: "hello@example.com",

  /** Support email */
  supportEmail: "support@example.com",

  /** Domain (update when known) */
  domain: "example.com",

  /** Social links */
  social: {
    twitter: "",
    linkedin: "",
    github: "",
  },

  /** Copyright year */
  copyrightYear: new Date().getFullYear(),
} as const;

export type Brand = typeof brand;
