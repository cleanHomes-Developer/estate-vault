import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { brand } from "@/config/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-vault flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-gold" aria-hidden="true" />
          <span className="font-serif text-xl font-light text-white/88">{brand.name}</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-white/30">
          &copy; {brand.copyrightYear} {brand.legalEntity}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
