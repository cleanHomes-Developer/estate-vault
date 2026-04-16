"use client";

import React, { useState } from "react";
import Link from "next/link";
import { copy } from "@/config/copy";
import { Shield, Lock, Key, Server, Globe, Smartphone, ArrowRight } from "lucide-react";

export default function SecurityPage() {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(0);

  const layerIcons = [Key, Lock, Shield, Server, Globe, Smartphone];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">Security</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            {copy.security.heading}
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto">
            {copy.security.subtitle}
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing max-w-4xl">
          <div className="space-y-4">
            {copy.security.layers.map((layer, i) => {
              const Icon = layerIcons[i];
              const isExpanded = expandedLayer === i;
              return (
                <div
                  key={i}
                  className={`rounded-lg border transition-all ${
                    isExpanded ? "border-gold/30 bg-white shadow-card" : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : i)}
                    className="w-full flex items-center gap-4 p-6 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isExpanded ? "bg-gold/10" : "bg-parchment-dark"
                    }`}>
                      <Icon className={`h-5 w-5 ${isExpanded ? "text-gold" : "text-ink-muted"}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gold">Layer {i + 1}</span>
                      </div>
                      <h3 className="font-medium text-ink mt-0.5">{layer.title}</h3>
                    </div>
                    <div className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      <svg className="h-5 w-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ink/5">
                        <div>
                          <p className="label-mono text-ink-muted mb-2">Plain English</p>
                          <p className="text-sm text-ink leading-relaxed">{layer.plain}</p>
                        </div>
                        <div className="rounded-lg bg-parchment-dark p-4">
                          <p className="label-mono text-gold mb-2">Technical detail</p>
                          <p className="text-sm font-mono text-ink-muted leading-relaxed">{layer.technical}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="section-padding bg-parchment-dark">
        <div className="container-marketing max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="heading-section text-ink">Zero-knowledge architecture</h2>
            <p className="body-base text-ink-muted mt-4">
              Your data is encrypted before it leaves your device. Our servers store only ciphertext.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-ink/10 p-8">
            <div className="flex flex-col items-center gap-4">
              {[
                { label: "Your Device", sublabel: "Encryption happens here", color: "bg-success/10 text-success" },
                { label: "TLS 1.3", sublabel: "Encrypted transport", color: "bg-gold/10 text-gold" },
                { label: "Our Servers", sublabel: "Store only ciphertext", color: "bg-parchment-dark text-ink-muted" },
              ].map((node, i) => (
                <React.Fragment key={i}>
                  <div className={`w-full max-w-xs rounded-lg ${node.color} p-4 text-center`}>
                    <p className="font-medium text-sm">{node.label}</p>
                    <p className="text-xs mt-1 opacity-70">{node.sublabel}</p>
                  </div>
                  {i < 2 && (
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-ink/20" />
                      <Lock className="h-4 w-4 text-gold" aria-hidden="true" />
                      <div className="w-px h-6 bg-ink/20" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink">
        <div className="container-marketing text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Security you can verify
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Our cryptographic layer is open-source. Audit it yourself.
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
