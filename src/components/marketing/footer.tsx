import React from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { Shield } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-parchment-dark">
      <div className="container-marketing py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
              <span className="font-serif text-lg font-light text-ink">{brand.name}</span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed">
              {brand.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-4">Product</h3>
            <ul className="space-y-3">
              {copy.nav.marketing.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-4">Resources</h3>
            <ul className="space-y-3">
              {copy.nav.marketing.slice(3).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/register" className="text-sm text-ink-muted hover:text-ink transition-colors">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-4">Legal</h3>
            <ul className="space-y-3">
              {copy.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-muted">{copy.footer.copyright}</p>
          <p className="text-xs text-ink-muted">
            {brand.jurisdiction} &middot; Launching {brand.primaryMarket}-first
          </p>
        </div>
      </div>
    </footer>
  );
}
