"use client";

import React, { useState } from "react";
import { Eye, FolderOpen, MessageSquare, Shield, ChevronDown, Lock } from "lucide-react";

const beneficiaries = [
  { id: "1", name: "Sarah Mitchell", relationship: "Spouse" },
  { id: "2", name: "James Mitchell", relationship: "Child" },
  { id: "3", name: "Rebecca Torres, Esq.", relationship: "Attorney" },
];

const simulatedAssets: Record<string, { name: string; category: string; fields: { label: string; value: string }[] }[]> = {
  "1": [
    {
      name: "Bitcoin Wallet (Ledger Nano X)",
      category: "Crypto",
      fields: [
        { label: "Wallet type", value: "Hardware (Ledger Nano X)" },
        { label: "Location", value: "Home safe, top drawer" },
        { label: "PIN hint", value: "Anniversary year + birth month" },
        { label: "Recovery seed", value: "[Encrypted — will be decrypted on access]" },
      ],
    },
    {
      name: "Schwab Brokerage",
      category: "Financial",
      fields: [
        { label: "Account number", value: "****-****-7842" },
        { label: "Login email", value: "user@example.com" },
        { label: "2FA method", value: "Authenticator app on personal phone" },
      ],
    },
    {
      name: "Domain Portfolio (Namecheap)",
      category: "Domains",
      fields: [
        { label: "Registrar", value: "Namecheap" },
        { label: "Domains", value: "example.com, example.io, example.app" },
        { label: "Auto-renew", value: "Enabled through 2028" },
      ],
    },
  ],
  "2": [
    {
      name: "Family Photos (iCloud)",
      category: "Documents",
      fields: [
        { label: "Service", value: "Apple iCloud" },
        { label: "Storage", value: "2 TB plan" },
        { label: "Shared albums", value: "Family 2020-2026" },
      ],
    },
    {
      name: "Netflix / Spotify / Apple One",
      category: "Subscriptions",
      fields: [
        { label: "Netflix", value: "Premium plan, family profile" },
        { label: "Spotify", value: "Family plan, 6 members" },
      ],
    },
  ],
  "3": [
    {
      name: "Bitcoin Wallet (Ledger Nano X)",
      category: "Crypto",
      fields: [
        { label: "Wallet type", value: "Hardware (Ledger Nano X)" },
        { label: "Estimated value", value: "[Encrypted — will be decrypted on access]" },
      ],
    },
    {
      name: "Life Insurance Policy",
      category: "Financial",
      fields: [
        { label: "Provider", value: "Northwestern Mutual" },
        { label: "Policy number", value: "NWM-****-****-3291" },
        { label: "Benefit amount", value: "[Encrypted — will be decrypted on access]" },
      ],
    },
  ],
};

const simulatedMessages: Record<string, { subject: string; preview: string; trigger: string }[]> = {
  "1": [
    { subject: "For Sarah — if I am not here", preview: "My dearest Sarah, if you are reading this...", trigger: "On check-in failure" },
    { subject: "Account passwords and instructions", preview: "Here are the steps to access our joint accounts...", trigger: "On check-in failure" },
  ],
  "2": [
    { subject: "For James — when you are ready", preview: "Son, there are things I want you to know...", trigger: "On check-in failure" },
  ],
  "3": [],
};

export default function SimulatorPage() {
  const [selectedBen, setSelectedBen] = useState(beneficiaries[0].id);
  const ben = beneficiaries.find((b) => b.id === selectedBen)!;
  const assets = simulatedAssets[selectedBen] || [];
  const messages = simulatedMessages[selectedBen] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-gold" aria-hidden="true" />
          <h1 className="text-2xl font-serif font-light text-white/88">Vault Simulator</h1>
        </div>
        <p className="text-sm text-white/55">
          Preview exactly what each trusted person would see if access were granted today.
        </p>
      </div>

      {/* Beneficiary selector */}
      <div className="card-vault">
        <label className="block text-xs text-white/55 mb-2">Viewing as</label>
        <div className="relative">
          <select
            value={selectedBen}
            onChange={(e) => setSelectedBen(e.target.value)}
            className="w-full md:w-auto rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 pr-10 text-sm text-white/88 appearance-none focus:border-gold/50 focus:outline-none"
            aria-label="Select beneficiary to simulate"
          >
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.relationship})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Simulated view banner */}
      <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex items-center gap-3">
        <Eye className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-gold">
          You are viewing the vault as <strong>{ben.name}</strong> ({ben.relationship}).
          This is exactly what they would see upon access.
        </p>
      </div>

      {/* Simulated assets */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">
            Assets ({assets.length})
          </h2>
        </div>
        <div className="space-y-4">
          {assets.map((asset, i) => (
            <div key={i} className="card-vault">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white/88">{asset.name}</h3>
                <span className="text-xs text-white/40">{asset.category}</span>
              </div>
              <div className="space-y-2">
                {asset.fields.map((field, j) => (
                  <div key={j} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/40 sm:w-40 flex-shrink-0">{field.label}</span>
                    <span className={`text-sm ${
                      field.value.includes("[Encrypted") ? "text-gold font-mono text-xs" : "text-white/70"
                    }`}>
                      {field.value.includes("[Encrypted") && <Lock className="inline h-3 w-3 mr-1" aria-hidden="true" />}
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="card-vault text-center py-8">
              <FolderOpen className="h-8 w-8 text-white/10 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-white/40">No assets assigned to this person</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulated messages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">
            Messages ({messages.length})
          </h2>
        </div>
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="card-vault">
              <h3 className="text-sm font-medium text-white/88 mb-1">{msg.subject}</h3>
              <p className="text-sm text-white/55 italic">&ldquo;{msg.preview}&rdquo;</p>
              <p className="text-xs text-white/30 mt-2">Trigger: {msg.trigger}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="card-vault text-center py-8">
              <MessageSquare className="h-8 w-8 text-white/10 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-white/40">No messages for this person</p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="card-vault border-white/10">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs text-white/55 leading-relaxed">
            This simulation shows the decrypted view each beneficiary would receive.
            In practice, encrypted fields marked with a lock icon would only be decrypted
            using the beneficiary&apos;s private key after access conditions are met.
          </p>
        </div>
      </div>
    </div>
  );
}
