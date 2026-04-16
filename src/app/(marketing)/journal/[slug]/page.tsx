"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { brand } from "@/config/brand";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const articles: Record<string, {
  title: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  content: string[];
}> = {
  "why-zero-knowledge": {
    title: "Why zero-knowledge encryption is non-negotiable for digital estate planning",
    date: "March 2026",
    readTime: "8 min read",
    author: "Security Team",
    category: "Security",
    content: [
      "When you entrust your most sensitive digital assets to a platform, the encryption model isn't just a technical detail — it's the foundation of trust. Zero-knowledge encryption means that even we, the operators of the platform, cannot access your data. Your master password never leaves your device, and all encryption and decryption happens locally.",
      "Traditional cloud storage services encrypt your data at rest, but they hold the keys. This means a data breach, a rogue employee, or a government subpoena could expose your information. With zero-knowledge architecture, none of these scenarios can compromise your vault contents.",
      "For digital estate planning specifically, this matters because the assets you're documenting — cryptocurrency wallets, business credentials, identity documents — are among the most sensitive data you possess. The consequences of unauthorized access aren't just privacy violations; they're potential financial catastrophes.",
      "Our implementation uses Argon2id for key derivation (the winner of the Password Hashing Competition), XChaCha20-Poly1305 for authenticated encryption, and a three-key hierarchy that enables selective sharing without compromising the master key. Every design decision prioritizes the principle that your data should be accessible only to you and your designated beneficiaries.",
      "The trade-off is real: if you lose both your master password and recovery key, we genuinely cannot help you recover your data. We believe this trade-off is not just acceptable but essential. Any system that can recover your data without your credentials is a system that can be compelled to do so.",
    ],
  },
  "building-trust-through-restraint": {
    title: "Building trust through restraint: our approach to data minimization",
    date: "February 2026",
    readTime: "6 min read",
    author: "Product Team",
    category: "Philosophy",
    content: [
      "In an industry where companies compete to collect more data, we've chosen a different path. Our philosophy is simple: collect only what we need, encrypt everything we can, and be transparent about what we can't encrypt.",
      "We know your email address because we need to send you check-in reminders. We know your subscription tier because we need to bill you. We know when you last logged in because we need to operate the check-in system. Beyond that, we know almost nothing about you — and that's by design.",
      "Your vault contents are encrypted with keys derived from your master password. We store the ciphertext, but we can't read it. We don't know how many assets you've documented, what categories they fall into, or who your beneficiaries are. Our database contains encrypted blobs, not structured records we can query.",
      "This approach has real costs. We can't offer smart suggestions based on your data. We can't build analytics dashboards about user behavior inside vaults. We can't monetize your information. But we believe these limitations are features, not bugs.",
      "Trust in estate planning technology must be earned through demonstrated restraint. When someone trusts you with the keys to their digital life — and the instructions for what happens after they're gone — the only appropriate response is to handle that trust with the minimum possible footprint.",
    ],
  },
  "rufadaa-explained": {
    title: "RUFADAA Chapter 2001: what Texas law says about your digital assets",
    date: "January 2026",
    readTime: "10 min read",
    author: "Legal Team",
    category: "Legal",
    content: [
      "The Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA), codified in Texas as Estates Code Chapter 2001, establishes the legal framework for managing digital assets after death or incapacity. Understanding this law is essential for anyone serious about digital estate planning.",
      "RUFADAA creates a three-tier priority system for digital asset access. First priority goes to the user's instructions in an online tool (like a digital vault). Second priority goes to the user's estate planning documents (wills, trusts, powers of attorney). Third priority falls to the terms of service of the digital platform.",
      "This priority system is why a dedicated digital estate vault is so powerful. By documenting your wishes in our platform, you're creating first-priority instructions under RUFADAA. These instructions supersede both your will and the platform's terms of service.",
      "The law distinguishes between three types of access: the catalogue of digital assets (a list of what exists), the content of digital assets (the actual data), and the ability to manage digital assets (delete, transfer, etc.). You can grant different levels of access to different fiduciaries.",
      "For Texas residents, RUFADAA provides a clear legal path for beneficiaries to access digital assets. But the law only works if your wishes are documented. Without explicit instructions, platforms default to their terms of service — which typically means deletion or permanent lockout.",
      "Our Exhibit A generator creates a RUFADAA-compliant document that estate attorneys can attach to wills and trusts. This document references your vault without exposing its contents, creating a legally recognized bridge between traditional estate planning and digital asset management.",
    ],
  },
  "why-we-built-this": {
    title: "Why we built this: the $140 billion problem nobody talks about",
    date: "December 2025",
    readTime: "7 min read",
    author: "Founding Team",
    category: "Company",
    content: [
      "Every year, an estimated $140 billion in digital assets becomes permanently inaccessible due to death or incapacity. Cryptocurrency wallets with no documented seed phrases. Business accounts with no succession plan. Subscription services that continue billing indefinitely. Digital photos and documents that families can never recover.",
      "We started this company after a personal experience with this problem. When a family member passed unexpectedly, the process of recovering their digital life was a months-long nightmare. Passwords were scattered across sticky notes and memory. Some accounts were simply lost forever.",
      "The existing solutions fell into two categories: password managers (which aren't designed for estate planning) and estate planning attorneys (who understand legal frameworks but not encryption). Neither addressed the full problem.",
      "We built this platform to bridge that gap. A tool that combines the security rigor of a password manager with the estate planning functionality that families actually need. Zero-knowledge encryption so your data stays private. Beneficiary management so the right people get access at the right time. Check-in systems so the transition happens when it should.",
      "The $140 billion problem isn't a technology problem or a legal problem — it's a design problem. The tools for managing digital assets after death need to be as thoughtfully designed as the tools for managing them during life. That's what we're building.",
    ],
  },
  "three-key-hierarchy": {
    title: "The three-key hierarchy: how selective sharing actually works",
    date: "November 2025",
    readTime: "9 min read",
    author: "Engineering Team",
    category: "Technical",
    content: [
      "One of the most common questions we receive is: how can you share specific assets with specific beneficiaries while maintaining zero-knowledge encryption? The answer lies in our three-key hierarchy.",
      "At the top of the hierarchy is the Master Key, derived from your master password using Argon2id. This key is never stored anywhere — it exists only in memory while your vault is unlocked. The Master Key encrypts and decrypts the Vault Key.",
      "The Vault Key is a randomly generated symmetric key that encrypts your vault's metadata and structure. It's stored encrypted by the Master Key. When you unlock your vault, the Master Key decrypts the Vault Key, which then provides access to the vault structure.",
      "Individual assets are encrypted with unique per-Asset Keys. Each Asset Key is encrypted by the Vault Key for your access, but it can also be encrypted with a beneficiary's public key for their access. This is where selective sharing happens.",
      "When you assign a beneficiary to an asset, we encrypt that asset's key with the beneficiary's X25519 public key. The beneficiary can only decrypt asset keys that were specifically shared with them. They never get access to the Vault Key or Master Key, so they can only see assets you've explicitly assigned to them.",
      "This architecture means that even if a beneficiary's credentials are compromised, only the specific assets assigned to them are at risk — not your entire vault. It's the cryptographic equivalent of giving someone a key to one room in your house, not the master key to every door.",
    ],
  },
  "check-in-system-design": {
    title: "Designing the check-in system: balancing safety with usability",
    date: "October 2025",
    readTime: "7 min read",
    author: "Product Team",
    category: "Product",
    content: [
      "The check-in system is perhaps the most sensitive feature in our platform. It determines when beneficiaries gain access to vault contents — a decision that must be both reliable and resistant to false triggers.",
      "Our design uses a configurable cadence: you choose how often you need to check in (weekly, biweekly, monthly, or quarterly). When a check-in is due, we send reminders via email and SMS. If you miss the check-in window, we enter a grace period with escalating notifications.",
      "The grace period is critical. We don't want a missed check-in during a vacation to trigger beneficiary access. The default grace period is 30 days, with notifications sent at increasing frequency. You can also designate a trusted contact who receives an alert before any access is granted.",
      "Only after the full grace period expires without any response do we begin the beneficiary access process. Even then, the process is gradual: beneficiaries are notified, given time to verify the situation, and access is released in stages rather than all at once.",
      "We also built in manual override capabilities. You can pause check-ins before a planned absence, extend the grace period, or designate someone who can confirm your status. The goal is to make the system robust enough to work when needed, but gentle enough to avoid false alarms.",
      "Every design decision in the check-in system was guided by a single principle: the cost of a false positive (granting access too early) is much higher than the cost of a false negative (delaying access). We err heavily on the side of caution.",
    ],
  },
};

export default function JournalArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="container-narrow section-padding text-center">
        <h1 className="heading-section text-ink mb-4">Article not found</h1>
        <p className="text-ink-muted mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/journal" className="btn-primary">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="container-narrow section-padding">
      <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold mb-8">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Journal
      </Link>

      <header className="mb-12">
        <span className="label-mono text-gold mb-4 block">{article.category}</span>
        <h1 className="heading-display text-ink mb-6">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" aria-hidden="true" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {article.readTime}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        {article.content.map((paragraph, i) => (
          <p key={i} className="body-large text-ink-muted leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-ink/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink">Ready to protect your digital legacy?</p>
            <p className="text-sm text-ink-muted">Start documenting your assets in minutes.</p>
          </div>
          <Link href="/register" className="btn-primary text-sm">
            Get started with {brand.name}
          </Link>
        </div>
      </footer>
    </article>
  );
}
