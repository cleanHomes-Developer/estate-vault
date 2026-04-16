"use client";

import React from "react";
import Link from "next/link";
import {
  FolderOpen, Users, Clock, ArrowRight, AlertTriangle,
  Check, Plus, Eye
} from "lucide-react";

// Mock data for demonstration
const healthScore = 72;
const stats = [
  { label: "Assets documented", value: "12", icon: FolderOpen, href: "/assets" },
  { label: "Trusted people", value: "3", icon: Users, href: "/beneficiaries" },
  { label: "Days until check-in", value: "18", icon: Clock, href: "/checkin" },
];

const recentAssets = [
  { name: "Bitcoin Wallet (Ledger Nano X)", category: "Crypto", status: "complete", updatedAt: "2 days ago" },
  { name: "Domain Portfolio (Namecheap)", category: "Domains", status: "complete", updatedAt: "5 days ago" },
  { name: "Schwab Brokerage", category: "Financial", status: "incomplete", updatedAt: "1 week ago" },
  { name: "AWS Root Account", category: "Business", status: "complete", updatedAt: "2 weeks ago" },
];

const suggestions = [
  { text: "Add a beneficiary to your Bitcoin Wallet", action: "Assign", href: "/assets" },
  { text: "Complete documentation for Schwab Brokerage", action: "Continue", href: "/assets" },
  { text: "Set up two-factor authentication", action: "Enable", href: "/security" },
];

const activityLog = [
  { action: "Checked in", time: "12 days ago", type: "checkin" },
  { action: "Updated Bitcoin Wallet", time: "2 days ago", type: "asset" },
  { action: "Added Domain Portfolio", time: "5 days ago", type: "asset" },
  { action: "Invited Sarah M. as beneficiary", time: "1 week ago", type: "beneficiary" },
];

function HealthRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#B8860B" : "#ef4444";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-serif font-light text-white/88">{score}</span>
        <span className="text-xs text-white/55">Health</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-white/88">Dashboard</h1>
          <p className="text-sm text-white/55 mt-1">Your digital estate at a glance</p>
        </div>
        <Link href="/assets/new" className="btn-primary text-sm inline-flex items-center gap-2 self-start">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add asset
        </Link>
      </div>

      {/* Health Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="card-vault flex flex-col items-center justify-center py-8">
          <HealthRing score={healthScore} />
          <p className="text-xs text-white/55 mt-4">
            {healthScore >= 80 ? "Excellent" : healthScore >= 50 ? "Needs attention" : "Critical"}
          </p>
        </div>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="card-vault group hover:border-gold/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white/55" aria-hidden="true" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-gold transition-colors" aria-hidden="true" />
              </div>
              <p className="text-3xl font-serif font-light text-white/88">{stat.value}</p>
              <p className="text-xs text-white/55 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card-vault border-gold/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-gold" aria-hidden="true" />
            <h2 className="text-sm font-medium text-gold">Suggestions</h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/70">{suggestion.text}</span>
                <Link href={suggestion.href} className="text-xs text-gold hover:text-gold-hover font-medium">
                  {suggestion.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Assets + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assets */}
        <div className="card-vault">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/88">Recent assets</h2>
            <Link href="/assets" className="text-xs text-gold hover:text-gold-hover">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentAssets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white/88">{asset.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{asset.category} &middot; {asset.updatedAt}</p>
                </div>
                <span className={`text-xs font-medium ${
                  asset.status === "complete" ? "text-success-light" : "text-warning"
                }`}>
                  {asset.status === "complete" ? "Documented" : "Incomplete"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="card-vault">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/88">Activity</h2>
          </div>
          <div className="space-y-3">
            {activityLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  entry.type === "checkin" ? "bg-success/10" : entry.type === "beneficiary" ? "bg-gold/10" : "bg-white/5"
                }`}>
                  {entry.type === "checkin" ? (
                    <Check className="h-3 w-3 text-success-light" aria-hidden="true" />
                  ) : entry.type === "beneficiary" ? (
                    <Users className="h-3 w-3 text-gold" aria-hidden="true" />
                  ) : (
                    <FolderOpen className="h-3 w-3 text-white/55" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/70">{entry.action}</p>
                  <p className="text-xs text-white/40 mt-0.5">{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vault Simulator Preview */}
      <div className="card-vault border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gold" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Vault Simulator</h2>
          </div>
          <Link href="/simulator" className="text-xs text-gold hover:text-gold-hover flex items-center gap-1">
            Open simulator
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-sm text-white/55">
          Preview exactly what each trusted person would see if access were granted today.
          No surprises, no ambiguity.
        </p>
      </div>
    </div>
  );
}
