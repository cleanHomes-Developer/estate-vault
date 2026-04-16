import React from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { ArrowRight, Clock } from "lucide-react";

export const metadata = { title: "Journal" };

const posts = [
  {
    slug: "why-zero-knowledge",
    title: "Why zero-knowledge encryption is non-negotiable for digital estate planning",
    excerpt: "Most estate tools store your data in plaintext on their servers. We explain why that approach is fundamentally broken and how zero-knowledge architecture changes the equation.",
    category: "Security",
    readTime: "8 min",
    date: "2026-03-15",
    author: { name: "Engineering Team", role: `${brand.name} Security` },
  },
  {
    slug: "building-trust-through-restraint",
    title: "Building trust through restraint: our approach to product design",
    excerpt: "In a market full of feature-bloated apps, we chose a different path. Every screen, every interaction, every word was designed to earn trust through simplicity.",
    category: "Product",
    readTime: "6 min",
    date: "2026-03-01",
    author: { name: "Design Team", role: `${brand.name} Design` },
  },
  {
    slug: "rufadaa-explained",
    title: "RUFADAA Chapter 2001: what Texas law says about your digital assets",
    excerpt: "The Revised Uniform Fiduciary Access to Digital Assets Act gives executors authority over digital accounts. Here is what it means for you and your estate plan.",
    category: "Legal",
    readTime: "10 min",
    date: "2026-02-15",
    author: { name: "Legal Team", role: `${brand.name} Legal` },
  },
  {
    slug: "why-we-built-this",
    title: "Why we built this: the $140 billion problem nobody talks about",
    excerpt: "Every year, billions in digital assets become permanently inaccessible. We started this company because we believe documentation is a form of care.",
    category: "Company",
    readTime: "7 min",
    date: "2026-02-01",
    author: { name: "Founding Team", role: `${brand.name}` },
  },
  {
    slug: "three-key-hierarchy",
    title: "The three-key hierarchy: how selective sharing actually works",
    excerpt: "A deep dive into our cryptographic architecture. How master keys, vault keys, and per-asset keys enable you to share one asset without exposing others.",
    category: "Security",
    readTime: "12 min",
    date: "2026-01-15",
    author: { name: "Engineering Team", role: `${brand.name} Security` },
  },
  {
    slug: "check-in-system-design",
    title: "Designing the check-in system: balancing safety with peace of mind",
    excerpt: "The check-in system is the heartbeat of your vault. We explain the design decisions behind intervals, quorums, travel pauses, and the notification cascade.",
    category: "Product",
    readTime: "9 min",
    date: "2026-01-01",
    author: { name: "Product Team", role: `${brand.name} Product` },
  },
];

export default function JournalPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">Journal</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            Thoughts on security, product, and law
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto">
            How we think about building a product that people trust with their most important information.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing max-w-4xl">
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="card-marketing group hover:border-gold/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="label-mono text-gold">{post.category}</span>
                  <span className="text-ink-muted/30">&middot;</span>
                  <span className="flex items-center gap-1 text-xs text-ink-muted">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {post.readTime}
                  </span>
                  <span className="text-ink-muted/30">&middot;</span>
                  <time className="text-xs text-ink-muted" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="heading-card text-ink mb-2 group-hover:text-gold transition-colors">
                  <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{post.author.name}</p>
                    <p className="text-xs text-ink-muted">{post.author.role}</p>
                  </div>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold-hover"
                  >
                    Read
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
