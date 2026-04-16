"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import {
  LayoutDashboard, Users, DollarSign, FileText,
  BookOpen, Settings, LogOut, Menu, X, Briefcase
} from "lucide-react";

const navItems = [
  { href: "/partner/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/partner/clients", label: "Clients", icon: Users },
  { href: "/partner/revenue", label: "Revenue", icon: DollarSign },
  { href: "/partner/exhibit-a", label: "Exhibit A", icon: FileText },
  { href: "/partner/resources", label: "Resources", icon: BookOpen },
  { href: "/partner/settings", label: "Settings", icon: Settings },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-ink/10">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 px-6 h-16 border-b border-ink/10">
            <Briefcase className="h-5 w-5 text-gold" aria-hidden="true" />
            <div>
              <span className="font-serif text-lg font-light text-ink">{brand.name}</span>
              <span className="block text-xs text-ink-muted -mt-0.5">Partner Portal</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Partner navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-ink-muted hover:text-ink hover:bg-parchment-dark"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-ink/10">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-parchment-dark w-full transition-colors">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-ink/10 z-50">
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gold" aria-hidden="true" />
                <span className="font-serif text-lg font-light text-ink">{brand.name}</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-ink-muted hover:text-ink">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? "bg-gold/10 text-gold" : "text-ink-muted hover:text-ink hover:bg-parchment-dark"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-64">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-ink/10">
          <button onClick={() => setSidebarOpen(true)} className="text-ink-muted hover:text-ink">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="font-serif text-sm font-light text-ink">Partner Portal</span>
          </div>
          <div className="w-5" />
        </header>

        <main className="p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
