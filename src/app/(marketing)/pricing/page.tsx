"use client";

import React, { useState } from "react";
import Link from "next/link";
import { copy } from "@/config/copy";
import { Check, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">Pricing</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            {copy.pricing.heading}
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto mb-10">
            {copy.pricing.subtitle}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full bg-parchment-dark p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAnnual ? "bg-white text-ink shadow-subtle" : "text-ink-muted hover:text-ink"
              }`}
              role="radio"
              aria-checked={!isAnnual}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAnnual ? "bg-white text-ink shadow-subtle" : "text-ink-muted hover:text-ink"
              }`}
              role="radio"
              aria-checked={isAnnual}
            >
              Annual
              <span className="ml-1.5 text-xs text-success">Save 22%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {copy.pricing.tiers.map((tier, i) => {
              const price = isAnnual ? tier.price.annual : tier.price.monthly;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-8 relative ${
                    tier.highlighted
                      ? "border-gold bg-white shadow-elevated scale-105"
                      : "border-ink/10 bg-white"
                  }`}
                >
                  {tier.highlighted && tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block bg-gold text-white text-xs font-medium px-3 py-1 rounded-full">
                        {tier.badge}
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="heading-card text-ink">{tier.name}</h3>
                    <p className="text-sm text-ink-muted mt-1">{tier.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-serif font-light text-ink">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-ink-muted ml-1">
                        /mo{"priceUnit" in tier ? ` ${(tier as { priceUnit: string }).priceUnit}` : ""}
                      </span>
                    )}
                    {isAnnual && tier.price.monthly > tier.price.annual && (
                      <p className="text-xs text-success mt-1">
                        ${tier.price.annual * 12}/year (save ${(tier.price.monthly - tier.price.annual) * 12}/year)
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm text-ink">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.name === "Business" ? "/partners" : "/register"}
                    className={`w-full text-center block ${
                      tier.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink">
        <div className="container-marketing text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Questions about pricing?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Every plan includes zero-knowledge encryption and the check-in system.
            Upgrade or cancel at any time.
          </p>
          <Link href="/faq" className="btn-primary text-base px-8 py-4">
            View FAQ
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
