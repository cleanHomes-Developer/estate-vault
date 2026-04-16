"use client";

import React, { useState } from "react";
import Link from "next/link";
import { copy } from "@/config/copy";
import { ArrowRight, Plus, Minus } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">FAQ</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            Frequently asked questions
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto">
            Answers to the questions we hear most often about security, pricing, and how the product works.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing max-w-3xl">
          <div className="space-y-3">
            {copy.faq.items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-lg border transition-all ${
                    isOpen ? "border-gold/30 bg-white shadow-card" : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={isOpen}
                    data-faq-item="true"
                  >
                    <span className="font-medium text-ink pr-4">{item.question}</span>
                    <span className="flex-shrink-0">
                      {isOpen ? (
                        <Minus className="h-4 w-4 text-gold" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink">
        <div className="container-marketing text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            We are happy to help. Reach out and we will respond within one business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4">
              Get started free
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <a href="mailto:hello@example.com" className="btn-secondary text-base px-8 py-4">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
