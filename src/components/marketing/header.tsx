"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { Shield, Menu, X } from "lucide-react";

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-parchment/95 backdrop-blur-sm border-b border-ink/5 shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <nav className="container-marketing flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Shield className="h-6 w-6 text-gold" aria-hidden="true" />
          <span className="font-serif text-xl font-light text-ink">{brand.name}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {copy.nav.marketing.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="btn-ghost text-sm">
            {copy.nav.ctaLogin}
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            {copy.nav.ctaRegister}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-parchment border-t border-ink/5">
          <div className="container-marketing py-6 space-y-4">
            {copy.nav.marketing.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-base text-ink-muted hover:text-ink py-2"
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-ink/10 space-y-3">
              <Link href="/login" className="btn-secondary w-full text-center block">
                {copy.nav.ctaLogin}
              </Link>
              <Link href="/register" className="btn-primary w-full text-center block">
                {copy.nav.ctaRegister}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
