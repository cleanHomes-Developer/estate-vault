"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import {
  Shield, ArrowRight, Lock, Clock, Eye, Key, FileText,
  Briefcase, Globe, Plus, Minus, Mail
} from "lucide-react";

// ─── Shield Canvas Animation ────────────────────────────────────────────────

function ShieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const fragments: { x: number; y: number; targetX: number; targetY: number; size: number; angle: number; opacity: number }[] = [];
    for (let i = 0; i < 24; i++) {
      fragments.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        targetX: 150 + Math.random() * 100,
        targetY: 100 + Math.random() * 200,
        size: 8 + Math.random() * 16,
        angle: Math.random() * Math.PI * 2,
        opacity: 0,
      });
    }

    let frame = 0;
    const totalFrames = 25 * 60; // 25 seconds at 60fps

    const animate = () => {
      ctx.clearRect(0, 0, 400, 400);
      const progress = Math.min(1, frame / totalFrames);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      fragments.forEach((f) => {
        const currentX = f.x + (f.targetX - f.x) * ease;
        const currentY = f.y + (f.targetY - f.y) * ease;
        f.opacity = ease;

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(f.angle * (1 - ease));
        ctx.globalAlpha = f.opacity * 0.6;
        ctx.fillStyle = "#B8860B";
        ctx.beginPath();
        ctx.moveTo(0, -f.size);
        ctx.lineTo(f.size * 0.7, 0);
        ctx.lineTo(0, f.size);
        ctx.lineTo(-f.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="shield-canvas absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      aria-hidden="true"
      data-decorative="true"
    />
  );
}

// ─── Cycling Tagline ────────────────────────────────────────────────────────

function CyclingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % copy.hero.taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block transition-opacity duration-700">
      {copy.hero.taglines[index]}
    </span>
  );
}

// ─── Subscription Calculator ────────────────────────────────────────────────

function SubscriptionCalculator() {
  const [subs, setSubs] = useState<{ name: string; cost: string }[]>([
    { name: "", cost: "" },
  ]);
  const [email, setEmail] = useState("");

  const addSub = () => setSubs([...subs, { name: "", cost: "" }]);
  const removeSub = (i: number) => setSubs(subs.filter((_, idx) => idx !== i));
  const updateSub = (i: number, field: "name" | "cost", value: string) => {
    const updated = [...subs];
    updated[i][field] = value;
    setSubs(updated);
  };

  const monthly = subs.reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0);
  const annual = monthly * 12;
  const decade = monthly * 120;

  return (
    <div className="card-marketing max-w-lg mx-auto">
      <h3 className="heading-card text-ink mb-4">Subscription cost calculator</h3>
      <p className="text-sm text-ink-muted mb-6">
        Add your monthly subscriptions to see how much you spend — and how much could be lost.
      </p>
      <div className="space-y-3 mb-6">
        {subs.map((sub, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={sub.name}
              onChange={(e) => updateSub(i, "name", e.target.value)}
              placeholder="Service name"
              className="flex-1 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
              aria-label={`Subscription ${i + 1} name`}
            />
            <input
              type="number"
              value={sub.cost}
              onChange={(e) => updateSub(i, "cost", e.target.value)}
              placeholder="$/mo"
              className="w-24 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
              aria-label={`Subscription ${i + 1} monthly cost`}
            />
            {subs.length > 1 && (
              <button
                onClick={() => removeSub(i)}
                className="p-2 text-ink-muted hover:text-danger"
                aria-label={`Remove subscription ${i + 1}`}
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addSub} className="flex items-center gap-1 text-sm text-gold hover:text-gold-hover">
          <Plus className="h-4 w-4" /> Add subscription
        </button>
      </div>
      {monthly > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-parchment-dark mb-6">
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-ink">${monthly.toFixed(0)}</p>
            <p className="text-xs text-ink-muted">per month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-ink">${annual.toFixed(0)}</p>
            <p className="text-xs text-ink-muted">per year</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-gold">${decade.toFixed(0)}</p>
            <p className="text-xs text-ink-muted">per decade</p>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for a free audit template"
          className="flex-1 rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
          aria-label="Email for subscription audit template"
        />
        <button className="btn-primary text-sm px-4" aria-label="Send audit template">
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Send</span>
        </button>
      </div>
    </div>
  );
}

// ─── Home Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const featureIcons = [Lock, Key, Clock, Eye, Globe, FileText, FileText, Briefcase];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <ShieldCanvas />
        <div className="container-marketing relative z-10 text-center">
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            <CyclingTagline />
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto mb-10">
            {copy.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4">
              {copy.hero.ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-base px-8 py-4">
              {copy.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-parchment-dark">
        <div className="container-marketing">
          <div className="text-center mb-16">
            <p className="label-mono text-gold mb-4">The problem</p>
            <h2 className="heading-section text-ink">{copy.problem.heading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {copy.problem.stats.map((stat, i) => (
              <div key={i} className="card-marketing text-center">
                <p className="text-4xl md:text-5xl font-serif font-light text-gold mb-3">
                  {stat.value}
                </p>
                <p className="font-medium text-ink mb-2">{stat.label}</p>
                <p className="text-sm text-ink-muted">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive App Mockup */}
      <section className="section-padding">
        <div className="container-marketing">
          <div className="text-center mb-12">
            <p className="label-mono text-gold mb-4">Your vault</p>
            <h2 className="heading-section text-ink">Everything in one secure place</h2>
          </div>
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-elevated border border-ink/10">
            <div className="bg-vault p-1">
              {/* Mock browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-4 h-7 rounded-md bg-white/5 flex items-center px-3">
                  <Lock className="h-3 w-3 text-success-light mr-2" aria-hidden="true" />
                  <span className="text-xs text-white/40 font-mono">app.{brand.domain}/dashboard</span>
                </div>
              </div>
              {/* Mock dashboard */}
              <div className="bg-vault-elevated p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="card-vault">
                    <p className="text-xs text-white/55 mb-1">Health Score</p>
                    <p className="text-3xl font-serif font-light text-gold">87</p>
                  </div>
                  <div className="card-vault">
                    <p className="text-xs text-white/55 mb-1">Assets Documented</p>
                    <p className="text-3xl font-serif font-light text-white/88">24</p>
                  </div>
                  <div className="card-vault">
                    <p className="text-xs text-white/55 mb-1">Trusted People</p>
                    <p className="text-3xl font-serif font-light text-white/88">3</p>
                  </div>
                </div>
                <div className="card-vault">
                  <p className="text-xs text-white/55 mb-3">Recent Assets</p>
                  {["Bitcoin Wallet (Ledger)", "Domain Portfolio", "Schwab Brokerage"].map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-white/88">{a}</span>
                      <span className="text-xs text-success-light">Documented</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-parchment-dark">
        <div className="container-marketing">
          <div className="text-center mb-16">
            <p className="label-mono text-gold mb-4">How it works</p>
            <h2 className="heading-section text-ink">{copy.howItWorks.heading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {copy.howItWorks.steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-sm text-gold">{step.number}</span>
                </div>
                <h3 className="heading-card text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container-marketing">
          <div className="text-center mb-16">
            <p className="label-mono text-gold mb-4">Features</p>
            <h2 className="heading-section text-ink">{copy.features.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.features.items.map((feature, i) => {
              const Icon = featureIcons[i] || Shield;
              return (
                <div key={i} className="card-marketing group hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium text-ink mb-2">{feature.title}</h3>
                  <p className="text-sm text-ink-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscription Calculator */}
      <section className="section-padding bg-parchment-dark">
        <div className="container-marketing">
          <div className="text-center mb-12">
            <p className="label-mono text-gold mb-4">Calculator</p>
            <h2 className="heading-section text-ink">What are your subscriptions really costing you?</h2>
            <p className="body-base text-ink-muted mt-4 max-w-2xl mx-auto">
              Most people underestimate their recurring digital spend. Add your subscriptions
              below to see the true cost — and what could be lost without documentation.
            </p>
          </div>
          <SubscriptionCalculator />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-marketing">
          <div className="text-center mb-16">
            <p className="label-mono text-gold mb-4">Trusted by</p>
            <h2 className="heading-section text-ink">What people are saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I had no idea how much digital wealth I had accumulated until I started documenting it. This should be part of every estate plan.",
                name: "Sarah M.",
                role: "Estate Attorney, Austin TX",
              },
              {
                quote: "The zero-knowledge architecture is exactly what I was looking for. I can finally document my crypto holdings without trusting a third party with the keys.",
                name: "James K.",
                role: "Bitcoin Investor",
              },
              {
                quote: "As a financial adviser, I recommend this to every client. The partner portal makes it seamless to integrate into our existing practice.",
                name: "Rebecca L.",
                role: "CFP, Dallas TX",
              },
            ].map((testimonial, i) => (
              <div key={i} className="card-marketing">
                <blockquote className="text-ink leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-medium text-ink text-sm">{testimonial.name}</p>
                  <p className="text-xs text-ink-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-ink">
        <div className="container-marketing text-center">
          <Shield className="h-12 w-12 text-gold mx-auto mb-6" aria-hidden="true" />
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
            Begin documenting your digital estate
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10">
            Your assets deserve the same care as everything else you have built.
            Start with a free account — no credit card required.
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
