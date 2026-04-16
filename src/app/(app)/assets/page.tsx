"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderOpen, Plus, Search, Grid, List,
  Bitcoin, Globe, Landmark, Briefcase, CreditCard, FileText,
  MessageSquare, Package, User
} from "lucide-react";

const CATEGORIES = [
  { value: "ALL", label: "All", icon: FolderOpen },
  { value: "CRYPTO", label: "Crypto", icon: Bitcoin },
  { value: "DOMAINS", label: "Domains", icon: Globe },
  { value: "FINANCIAL", label: "Financial", icon: Landmark },
  { value: "BUSINESS", label: "Business", icon: Briefcase },
  { value: "IDENTITY", label: "Identity", icon: User },
  { value: "SUBSCRIPTIONS", label: "Subscriptions", icon: CreditCard },
  { value: "MESSAGES", label: "Messages", icon: MessageSquare },
  { value: "DOCUMENTS", label: "Documents", icon: FileText },
  { value: "OTHER", label: "Other", icon: Package },
];

const mockAssets = [
  { id: "1", name: "Bitcoin Wallet (Ledger Nano X)", category: "CRYPTO", status: "complete", beneficiaries: 2, updatedAt: "2 days ago" },
  { id: "2", name: "Ethereum Wallet (MetaMask)", category: "CRYPTO", status: "complete", beneficiaries: 1, updatedAt: "1 week ago" },
  { id: "3", name: "Domain Portfolio (Namecheap)", category: "DOMAINS", status: "complete", beneficiaries: 1, updatedAt: "5 days ago" },
  { id: "4", name: "Schwab Brokerage", category: "FINANCIAL", status: "incomplete", beneficiaries: 0, updatedAt: "1 week ago" },
  { id: "5", name: "AWS Root Account", category: "BUSINESS", status: "complete", beneficiaries: 2, updatedAt: "2 weeks ago" },
  { id: "6", name: "Google Workspace Admin", category: "BUSINESS", status: "complete", beneficiaries: 1, updatedAt: "3 weeks ago" },
  { id: "7", name: "Passport & SSN", category: "IDENTITY", status: "complete", beneficiaries: 1, updatedAt: "1 month ago" },
  { id: "8", name: "Netflix / Spotify / Apple One", category: "SUBSCRIPTIONS", status: "incomplete", beneficiaries: 0, updatedAt: "2 weeks ago" },
  { id: "9", name: "Family Photos (iCloud)", category: "DOCUMENTS", status: "complete", beneficiaries: 3, updatedAt: "3 days ago" },
  { id: "10", name: "Life Insurance Policy", category: "FINANCIAL", status: "complete", beneficiaries: 1, updatedAt: "1 month ago" },
  { id: "11", name: "Vanguard 401(k)", category: "FINANCIAL", status: "complete", beneficiaries: 1, updatedAt: "2 months ago" },
  { id: "12", name: "Personal Website (Vercel)", category: "DOMAINS", status: "incomplete", beneficiaries: 0, updatedAt: "3 weeks ago" },
];

function getCategoryIcon(category: string) {
  const cat = CATEGORIES.find((c) => c.value === category);
  return cat?.icon || Package;
}

export default function AssetsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = mockAssets.filter((a) => {
    if (filter !== "ALL" && a.category !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-white/88">Assets</h1>
          <p className="text-sm text-white/55 mt-1">{mockAssets.length} documented assets</p>
        </div>
        <Link href="/assets/new" className="btn-primary text-sm inline-flex items-center gap-2 self-start">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add asset
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20"
            aria-label="Search assets"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-white/10 text-white/88" : "text-white/40 hover:text-white/60"}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-white/10 text-white/88" : "text-white/40 hover:text-white/60"}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = cat.value === "ALL" ? mockAssets.length : mockAssets.filter((a) => a.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === cat.value
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "bg-white/5 text-white/55 border border-white/10 hover:border-white/20"
              }`}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              {cat.label}
              <span className="text-white/30">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => {
            const Icon = getCategoryIcon(asset.category);
            return (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="card-vault group hover:border-gold/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white/55" aria-hidden="true" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    asset.status === "complete"
                      ? "bg-success/10 text-success-light"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {asset.status === "complete" ? "Documented" : "Incomplete"}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white/88 mb-1 group-hover:text-gold transition-colors">
                  {asset.name}
                </h3>
                <p className="text-xs text-white/40">
                  {CATEGORIES.find((c) => c.value === asset.category)?.label} &middot; {asset.beneficiaries} beneficiar{asset.beneficiaries === 1 ? "y" : "ies"} &middot; {asset.updatedAt}
                </p>
              </Link>
            );
          })}

          {/* Add asset card */}
          <Link
            href="/assets/new"
            className="card-vault border-dashed border-white/10 hover:border-gold/30 flex flex-col items-center justify-center py-8 transition-colors group"
          >
            <Plus className="h-8 w-8 text-white/20 group-hover:text-gold transition-colors mb-2" aria-hidden="true" />
            <span className="text-sm text-white/40 group-hover:text-gold transition-colors">Add asset</span>
          </Link>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="card-vault divide-y divide-white/5">
          {filtered.map((asset) => {
            const Icon = getCategoryIcon(asset.category);
            return (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="flex items-center gap-4 py-3 px-1 hover:bg-white/[0.02] transition-colors first:pt-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-white/55" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/88 truncate">{asset.name}</p>
                  <p className="text-xs text-white/40">{CATEGORIES.find((c) => c.value === asset.category)?.label}</p>
                </div>
                <div className="hidden sm:block text-xs text-white/40">{asset.beneficiaries} beneficiar{asset.beneficiaries === 1 ? "y" : "ies"}</div>
                <div className="hidden sm:block text-xs text-white/40">{asset.updatedAt}</div>
                <span className={`text-xs font-medium ${
                  asset.status === "complete" ? "text-success-light" : "text-warning"
                }`}>
                  {asset.status === "complete" ? "Documented" : "Incomplete"}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="card-vault text-center py-12">
          <FolderOpen className="h-12 w-12 text-white/10 mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-white/55">No assets found</p>
          <p className="text-xs text-white/30 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
