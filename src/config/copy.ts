/**
 * Copy & Voice Configuration
 *
 * Centralised copy strings for consistent tone across the product.
 * Voice: Understated, British-inflected, trust-first.
 *
 * Rules:
 * - Never use "legacy" (too morbid)
 * - Never use "stored" — use "documented"
 * - Never use "emergency contacts" — use "trusted people"
 * - Never be salesy
 * - Tone: private bank / law firm, not tech startup
 */

import { brand } from "./brand";

export const copy = {
  hero: {
    taglines: [
      "Everything you have built, remembered.",
      "Everything you have built, protected.",
      "Everything you have built, passed on.",
      "Everything you have built, preserved.",
      "Everything you have built, honoured.",
    ],
    subtitle:
      "Document your digital assets. Assign trusted people. Ensure nothing is lost.",
    ctaPrimary: "Begin documenting",
    ctaSecondary: "See how it works",
  },

  problem: {
    heading: "The problem no one talks about",
    stats: [
      {
        value: "$140B",
        label: "in digital assets lost annually",
        description:
          "Crypto wallets, domain portfolios, and financial accounts become permanently inaccessible every year.",
      },
      {
        value: "60%",
        label: "have told nobody",
        description:
          "The majority of digital asset holders have not shared access instructions with anyone.",
      },
      {
        value: "7%",
        label: "include digital assets in wills",
        description:
          "Traditional estate planning was designed for physical property. Digital assets are an afterthought.",
      },
    ],
  },

  howItWorks: {
    heading: "Three steps to certainty",
    steps: [
      {
        number: "01",
        title: "Document",
        description:
          "Add your digital assets — crypto wallets, domains, financial accounts, subscriptions, and more. Everything is encrypted on your device before it leaves.",
      },
      {
        number: "02",
        title: "Assign",
        description:
          "Choose trusted people for each asset. They receive only what you intend, nothing more. Assign messages, instructions, and conditions.",
      },
      {
        number: "03",
        title: "Protect",
        description:
          "Set your check-in schedule. If you become unreachable, your trusted people gain access through a controlled, verifiable process.",
      },
    ],
  },

  features: {
    heading: "Built for what matters",
    items: [
      {
        title: "Zero-knowledge encryption",
        description: "Your data is encrypted on your device. We cannot read it. No one can.",
      },
      {
        title: "Selective sharing",
        description: "Each asset has its own encryption key. Share one without exposing others.",
      },
      {
        title: "Check-in system",
        description: "A quiet, configurable heartbeat. Miss it, and the process begins — on your terms.",
      },
      {
        title: "Vault simulator",
        description: "See exactly what each trusted person would receive. No surprises.",
      },
      {
        title: "Nine asset categories",
        description: "Crypto, domains, financial accounts, business logins, identity documents, subscriptions, messages, files, and more.",
      },
      {
        title: "Personal messages",
        description: "Written, audio, or video messages delivered at the right moment.",
      },
      {
        title: "Exhibit A export",
        description: "Generate a schedule attachment formatted for Texas wills under RUFADAA Chapter 2001.",
      },
      {
        title: "Partner portal",
        description: "Estate attorneys and financial advisers manage client vaults under their own brand.",
      },
    ],
  },

  pricing: {
    heading: "Straightforward pricing",
    subtitle: "No hidden fees. Cancel at any time.",
    tiers: [
      {
        name: "Free",
        price: { monthly: 0, annual: 0 },
        description: "For individuals getting started.",
        features: [
          "Up to 5 assets",
          "2 trusted people",
          "Zero-knowledge encryption",
          "Check-in system",
          "Community support",
        ],
        cta: "Start free",
        highlighted: false,
      },
      {
        name: "Pro",
        price: { monthly: 9, annual: 7 },
        description: "For those who take this seriously.",
        features: [
          "Unlimited assets",
          "Unlimited trusted people",
          "Personal messages (written, audio, video)",
          "Vault simulator",
          "Exhibit A export",
          "Subscription tracker",
          "Priority support",
        ],
        cta: "Start with Pro",
        highlighted: true,
        badge: "Most popular",
      },
      {
        name: "Business",
        price: { monthly: 22, annual: 22 },
        priceUnit: "per user",
        description: "For firms and advisers.",
        features: [
          "Everything in Pro",
          "Partner portal",
          "White-label onboarding",
          "Client vault health overview",
          "Revenue share dashboard",
          "SOC 2 compliance",
          "Dedicated account manager",
        ],
        cta: "Apply for Business",
        highlighted: false,
      },
    ],
  },

  security: {
    heading: "Six layers between your data and everyone else",
    subtitle:
      "Security is not a feature we added. It is the foundation everything else is built upon.",
    layers: [
      {
        title: "Argon2id password hardening",
        plain:
          "Your password is transformed into an encryption key using Argon2id — the most resistant algorithm against brute-force attacks. Even if someone obtained the result, reversing it would take centuries.",
        technical:
          "Argon2id with 64 MB memory, 3 iterations, parallelism 4, producing a 32-byte derived key. Resistant to GPU, ASIC, and side-channel attacks.",
      },
      {
        title: "SRP-6a private sign-in",
        plain:
          "Your password never leaves your device — not even in encrypted form. We verify you know it without ever seeing it. A compromised server reveals nothing.",
        technical:
          "Secure Remote Password protocol (SRP-6a) with 4096-bit group. Server stores only verifier and salt. Zero password-equivalent data at rest.",
      },
      {
        title: "Three-key hierarchy",
        plain:
          "Your data is protected by three layers of keys, each unlocking only the next. Sharing one asset with a trusted person does not expose any other.",
        technical:
          "Master key (Argon2id-derived) → vault key (random, encrypted with master) → per-asset keys (random, encrypted with vault key). Beneficiary access via asymmetric re-encryption.",
      },
      {
        title: "XChaCha20-Poly1305 vault encryption",
        plain:
          "Every piece of data in your vault is encrypted with a modern, authenticated cipher. If even a single bit is tampered with, decryption fails entirely.",
        technical:
          "XChaCha20-Poly1305 via libsodium crypto_secretbox_easy. 24-byte nonce, 32-byte key. AEAD construction prevents tampering and truncation.",
      },
      {
        title: "TLS 1.3 transport",
        plain:
          "All communication between your device and our servers is encrypted in transit using the latest transport security standard.",
        technical:
          "TLS 1.3 with forward secrecy. Certificate pinning on mobile clients. HSTS preloading.",
      },
      {
        title: "Two-step verification",
        plain:
          "Even if someone learns your password, they cannot sign in without your second factor — a time-based code from your authenticator app or a hardware security key.",
        technical:
          "TOTP (RFC 6238) with SHA-256, 6-digit codes, 30-second step. WebAuthn/FIDO2 for hardware keys. 10 single-use backup codes generated at setup.",
      },
    ],
  },

  nav: {
    marketing: [
      { label: "Features", href: "/features" },
      { label: "Security", href: "/security" },
      { label: "Pricing", href: "/pricing" },
      { label: "Partners", href: "/partners" },
      { label: "Journal", href: "/journal" },
      { label: "FAQ", href: "/faq" },
    ],
    ctaLogin: "Sign in",
    ctaRegister: "Get started",
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "How is this different from a password manager?",
        answer:
          "Password managers help you access your own accounts. We help your trusted people access them when you no longer can. The encryption model, sharing model, and check-in system are fundamentally different.",
      },
      {
        question: "Can you see my data?",
        answer:
          "No. Your vault is encrypted on your device before anything reaches our servers. We hold only ciphertext. Without your master password or recovery key, the data is unreadable — even to us.",
      },
      {
        question: "What happens if I forget my password?",
        answer:
          "During registration, you receive a recovery key. This key independently encrypts your vault key and can restore access. Without either your password or recovery key, your vault cannot be decrypted — by anyone.",
      },
      {
        question: "How does the check-in system work?",
        answer:
          "You set a schedule (e.g. every 30 days). We send a quiet reminder. If you confirm, nothing happens. If you miss multiple check-ins, a waiting period begins. After the waiting period, your trusted people are notified and granted access to their assigned assets.",
      },
      {
        question: "Is this legally valid?",
        answer:
          "The platform is designed for compliance with RUFADAA and Texas Estates Code Chapter 2001. The Exhibit A export generates a schedule attachment formatted for Texas wills. We recommend working with an estate attorney to integrate it into your estate plan.",
      },
      {
        question: "What asset types are supported?",
        answer:
          "Nine categories: cryptocurrency wallets, domain names, financial accounts, business logins, identity documents, subscriptions, personal messages, important files, and a general category for anything else.",
      },
      {
        question: "Can I try it for free?",
        answer:
          "Yes. The free tier includes up to 5 assets, 2 trusted people, full zero-knowledge encryption, and the check-in system. No credit card required.",
      },
      {
        question: "How do trusted people receive access?",
        answer:
          "Each trusted person receives only the specific assets you have assigned to them. Their copy of the encryption key is sealed with their own key pair. They cannot see assets assigned to others.",
      },
    ],
  },

  footer: {
    tagline: `${brand.name} — your digital estate, documented and protected.`,
    copyright: `© ${brand.copyrightYear} ${brand.legalEntity}. All rights reserved.`,
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;
