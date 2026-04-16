import React from "react";
import Link from "next/link";
import { Lock, Key, Clock, Eye, Globe, FileText, Briefcase, ArrowRight, Check } from "lucide-react";

export const metadata = { title: "Features" };

const featureDetails = [
  {
    icon: Lock,
    title: "Zero-knowledge encryption",
    description: "Your data is encrypted on your device using XChaCha20-Poly1305 before it ever leaves. Our servers store only ciphertext. We cannot read your data, and neither can anyone who compromises our infrastructure.",
    details: ["Client-side encryption via libsodium", "XChaCha20-Poly1305 authenticated encryption", "Versioned ciphertext for future migration", "Secure memory zeroing after use"],
  },
  {
    icon: Key,
    title: "Three-key hierarchy",
    description: "Your vault uses a layered key system. Your master password derives a master key, which unlocks a vault key, which in turn unlocks individual per-asset keys. This architecture enables selective sharing without exposing your entire vault.",
    details: ["Argon2id key derivation (64 MB, 3 iterations)", "Random vault key encrypted with master key", "Per-asset keys for granular access control", "Asymmetric re-encryption for beneficiaries"],
  },
  {
    icon: Clock,
    title: "Configurable check-in system",
    description: "Set a check-in interval between 7 and 90 days. If you miss your check-in, the system begins a controlled notification process to your trusted people. Travel pause and quorum settings give you full control.",
    details: ["7 to 90 day configurable intervals", "Travel pause for extended absences", "Quorum settings for multi-party confirmation", "Complete history log of all check-ins"],
  },
  {
    icon: Eye,
    title: "Vault simulator",
    description: "See exactly what each trusted person would receive if access were granted today. No surprises, no ambiguity. The simulator renders the precise view each beneficiary would see.",
    details: ["Per-beneficiary simulation view", "Real-time preview of assigned assets", "Message delivery preview", "Access condition verification"],
  },
  {
    icon: Globe,
    title: "Nine asset categories",
    description: "Purpose-built fields for every type of digital asset: crypto wallets with seed phrase support, domain registrars, financial accounts, business logins, identity documents, subscriptions, personal messages, important files, and a general category.",
    details: ["Crypto wallets with chain-specific fields", "Domain portfolios with registrar details", "Financial accounts and brokerage", "Business logins and SaaS accounts"],
  },
  {
    icon: FileText,
    title: "Personal messages",
    description: "Leave written, audio, or video messages for your trusted people. Set delivery triggers: on check-in failure, on a specific date, or when a specific asset is accessed.",
    details: ["Written, audio, and video formats", "Conditional delivery triggers", "Per-beneficiary message targeting", "End-to-end encrypted storage"],
  },
  {
    icon: FileText,
    title: "Exhibit A export",
    description: "Generate a PDF formatted as a schedule attachment to a Texas will under RUFADAA Chapter 2001. This document integrates with, not replaces, traditional estate planning.",
    details: ["Texas Estates Code compliant format", "Attorney-ready PDF output", "Automatic asset inventory", "Integrates with existing wills"],
  },
  {
    icon: Briefcase,
    title: "Partner portal",
    description: "Estate attorneys and financial advisers manage client vaults under their own brand. 20% revenue share, white-label onboarding, and professional resources designed for Texas practitioners.",
    details: ["White-label client onboarding", "Client vault health overview", "Revenue share dashboard", "Professional resource library"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">Features</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            Built for what matters
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto">
            Every feature exists because digital assets deserve the same careful
            documentation as physical property. Nothing more, nothing less.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing">
          <div className="space-y-16">
            {featureDetails.map((feature, i) => {
              const Icon = feature.icon;
              const isReversed = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-center`}
                >
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
                    </div>
                    <h2 className="heading-section text-ink mb-4">{feature.title}</h2>
                    <p className="body-base text-ink-muted mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-ink">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl bg-parchment-dark border border-ink/10 p-8 md:p-12 flex items-center justify-center min-h-[240px]">
                      <Icon className="h-24 w-24 text-gold/20" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink">
        <div className="container-marketing text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Ready to begin?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Start documenting your digital estate with a free account.
          </p>
          <Link href="/register" className="btn-primary text-base px-8 py-4">
            Get started free
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
