"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import {
  Shield, LayoutDashboard, FolderOpen, Users, Eye, MessageSquare,
  Clock, Lock, CreditCard, Settings, LogOut, Menu, X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: FolderOpen },
  { href: "/beneficiaries", label: "Beneficiaries", icon: Users },
  { href: "/simulator", label: "Vault Simulator", icon: Eye },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/checkin", label: "Check-in", icon: Clock },
  { href: "/vault-security", label: "Security", icon: Lock },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-vault flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-vault-elevated border-r border-white/5">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 h-16 border-b border-white/5">
            <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
            <span className="font-serif text-lg font-light text-white/88">{brand.name}</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="App navigation">
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
                      : "text-white/55 hover:text-white/88 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Vault status */}
          <div className="px-3 py-4 border-t border-white/5">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              <span className="text-xs text-white/55">Vault unlocked</span>
            </div>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/55 hover:text-white/88 hover:bg-white/5 w-full transition-colors">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-vault-elevated border-r border-white/5 z-50">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
                <span className="font-serif text-lg font-light text-white/88">{brand.name}</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-white/55 hover:text-white/88">
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
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-white/55 hover:text-white/88 hover:bg-white/5"
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

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-vault-elevated border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="text-white/55 hover:text-white/88">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="font-serif text-sm font-light text-white/88">{brand.name}</span>
          </div>
          <div className="w-5" /> {/* Spacer for centering */}
        </header>

        <main className="p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
