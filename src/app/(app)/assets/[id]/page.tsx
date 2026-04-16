"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Edit, Trash2, Users, Clock, Shield, Lock,
  Bitcoin, Globe, Landmark, Briefcase, CreditCard, FileText,
  MessageSquare, Package, User
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  CRYPTO: Bitcoin,
  DOMAINS: Globe,
  FINANCIAL: Landmark,
  BUSINESS: Briefcase,
  IDENTITY: User,
  SUBSCRIPTIONS: CreditCard,
  MESSAGES: MessageSquare,
  DOCUMENTS: FileText,
  OTHER: Package,
};

const mockAssets: Record<string, {
  name: string;
  category: string;
  status: string;
  beneficiaries: { name: string; access: string }[];
  updatedAt: string;
  createdAt: string;
  notes: string;
  fields: { label: string; value: string; sensitive: boolean }[];
}> = {
  "1": {
    name: "Bitcoin Wallet (Ledger Nano X)",
    category: "CRYPTO",
    status: "complete",
    beneficiaries: [
      { name: "Sarah Mitchell", access: "Full access" },
      { name: "James Mitchell", access: "View only" },
    ],
    updatedAt: "2 days ago",
    createdAt: "January 15, 2026",
    notes: "Primary cold storage wallet. Seed phrase stored in vault. Hardware device in home safe.",
    fields: [
      { label: "Wallet type", value: "Ledger Nano X (Hardware)", sensitive: false },
      { label: "Primary address", value: "bc1q...7k4m", sensitive: true },
      { label: "Seed phrase", value: "••••••••••••••••••••••••", sensitive: true },
      { label: "PIN", value: "••••", sensitive: true },
      { label: "Approximate value", value: "$45,000", sensitive: false },
    ],
  },
  "2": {
    name: "Ethereum Wallet (MetaMask)",
    category: "CRYPTO",
    status: "complete",
    beneficiaries: [{ name: "Sarah Mitchell", access: "Full access" }],
    updatedAt: "1 week ago",
    createdAt: "February 3, 2026",
    notes: "Browser extension wallet. Used for DeFi and NFTs.",
    fields: [
      { label: "Wallet type", value: "MetaMask (Browser)", sensitive: false },
      { label: "Primary address", value: "0x1a2b...9f8e", sensitive: true },
      { label: "Seed phrase", value: "••••••••••••••••••••••••", sensitive: true },
      { label: "Password", value: "••••••••", sensitive: true },
    ],
  },
  "3": {
    name: "Domain Portfolio (Namecheap)",
    category: "DOMAINS",
    status: "complete",
    beneficiaries: [{ name: "James Mitchell", access: "Full access" }],
    updatedAt: "5 days ago",
    createdAt: "December 10, 2025",
    notes: "12 domains registered. Auto-renew enabled. 2FA via authenticator app.",
    fields: [
      { label: "Registrar", value: "Namecheap", sensitive: false },
      { label: "Account email", value: "john@example.com", sensitive: false },
      { label: "Password", value: "••••••••", sensitive: true },
      { label: "2FA method", value: "Google Authenticator", sensitive: false },
      { label: "Number of domains", value: "12", sensitive: false },
    ],
  },
};

// Generate placeholder data for IDs 4-12
for (let i = 4; i <= 12; i++) {
  const names: Record<number, { name: string; cat: string }> = {
    4: { name: "Schwab Brokerage", cat: "FINANCIAL" },
    5: { name: "AWS Root Account", cat: "BUSINESS" },
    6: { name: "Google Workspace Admin", cat: "BUSINESS" },
    7: { name: "Passport & SSN", cat: "IDENTITY" },
    8: { name: "Netflix / Spotify / Apple One", cat: "SUBSCRIPTIONS" },
    9: { name: "Family Photos (iCloud)", cat: "DOCUMENTS" },
    10: { name: "Life Insurance Policy", cat: "FINANCIAL" },
    11: { name: "Vanguard 401(k)", cat: "FINANCIAL" },
    12: { name: "Personal Website (Vercel)", cat: "DOMAINS" },
  };
  const info = names[i];
  mockAssets[String(i)] = {
    name: info.name,
    category: info.cat,
    status: i % 3 === 1 ? "incomplete" : "complete",
    beneficiaries: i % 3 === 1 ? [] : [{ name: "Sarah Mitchell", access: "Full access" }],
    updatedAt: `${i} days ago`,
    createdAt: "2026",
    notes: `Documentation for ${info.name}.`,
    fields: [
      { label: "Account", value: info.name, sensitive: false },
      { label: "Credentials", value: "••••••••", sensitive: true },
    ],
  };
}

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const asset = mockAssets[id];
  const [showSensitive, setShowSensitive] = useState<Record<number, boolean>>({});

  if (!asset) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-serif text-white/88 mb-4">Asset not found</h1>
        <Link href="/assets" className="btn-primary text-sm">Back to Assets</Link>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[asset.category] || Package;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Link href="/assets" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-gold">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Assets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-white/55" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-light text-white/88">{asset.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                asset.status === "complete"
                  ? "bg-success/10 text-success-light"
                  : "bg-warning/10 text-warning"
              }`}>
                {asset.status === "complete" ? "Documented" : "Incomplete"}
              </span>
              <span className="text-xs text-white/40">Updated {asset.updatedAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm flex items-center gap-2" aria-label="Edit asset">
            <Edit className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-danger hover:border-danger/30 transition-colors" aria-label="Delete asset">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Encrypted fields */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-gold" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Encrypted fields</h2>
        </div>
        <div className="divide-y divide-white/5">
          {asset.fields.map((field, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-xs text-white/40 mb-0.5">{field.label}</p>
                <p className="text-sm text-white/88 font-mono">
                  {field.sensitive && !showSensitive[i] ? "••••••••" : field.value}
                </p>
              </div>
              {field.sensitive && (
                <button
                  onClick={() => setShowSensitive((prev) => ({ ...prev, [i]: !prev[i] }))}
                  className="text-xs text-gold hover:text-gold-hover"
                >
                  {showSensitive[i] ? "Hide" : "Reveal"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {asset.notes && (
        <div className="card-vault">
          <h2 className="text-sm font-medium text-white/88 mb-3">Notes</h2>
          <p className="text-sm text-white/55">{asset.notes}</p>
        </div>
      )}

      {/* Beneficiaries */}
      <div className="card-vault">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Beneficiaries ({asset.beneficiaries.length})</h2>
          </div>
          <button className="text-xs text-gold hover:text-gold-hover">Add beneficiary</button>
        </div>
        {asset.beneficiaries.length === 0 ? (
          <p className="text-sm text-white/40">No beneficiaries assigned to this asset.</p>
        ) : (
          <div className="space-y-3">
            {asset.beneficiaries.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-gold">{b.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/88">{b.name}</p>
                    <p className="text-xs text-white/40">{b.access}</p>
                  </div>
                </div>
                <button className="text-xs text-white/40 hover:text-white/70">Manage</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Security info</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-white/40">Created</p>
            <p className="text-white/70">{asset.createdAt}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Last updated</p>
            <p className="text-white/70">{asset.updatedAt}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Encryption</p>
            <p className="text-white/70">XChaCha20-Poly1305</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Key hierarchy</p>
            <p className="text-white/70">Per-asset key</p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Activity log</h2>
        </div>
        <div className="space-y-3">
          {[
            { action: "Fields updated", time: asset.updatedAt },
            { action: "Beneficiary added", time: "1 week ago" },
            { action: "Asset created", time: asset.createdAt },
          ].map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-white/70">{entry.action}</span>
              <span className="text-xs text-white/40">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
