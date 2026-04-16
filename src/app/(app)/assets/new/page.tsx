"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Lock,
  Bitcoin, Globe, Landmark, Briefcase, User, CreditCard,
  MessageSquare, FileText, Package, Upload
} from "lucide-react";

const CATEGORIES = [
  { value: "CRYPTO", label: "Crypto Wallets", icon: Bitcoin, description: "Bitcoin, Ethereum, hardware wallets, exchange accounts" },
  { value: "DOMAINS", label: "Domains", icon: Globe, description: "Domain names, registrars, DNS providers" },
  { value: "FINANCIAL", label: "Financial Accounts", icon: Landmark, description: "Bank accounts, brokerage, retirement, insurance" },
  { value: "BUSINESS", label: "Business Accounts", icon: Briefcase, description: "SaaS logins, cloud infrastructure, admin accounts" },
  { value: "IDENTITY", label: "Identity Documents", icon: User, description: "Passport, SSN, driver's license, birth certificate" },
  { value: "SUBSCRIPTIONS", label: "Subscriptions", icon: CreditCard, description: "Streaming, software, memberships" },
  { value: "MESSAGES", label: "Personal Messages", icon: MessageSquare, description: "Letters, notes, instructions for loved ones" },
  { value: "DOCUMENTS", label: "Documents & Files", icon: FileText, description: "Photos, videos, important files" },
  { value: "OTHER", label: "Other", icon: Package, description: "Anything else you want to document" },
];

const categoryFields: Record<string, { label: string; type: string; placeholder: string; sensitive?: boolean }[]> = {
  CRYPTO: [
    { label: "Wallet name", type: "text", placeholder: "e.g., Ledger Nano X — Bitcoin" },
    { label: "Wallet type", type: "select", placeholder: "Hardware|Software|Exchange|Paper" },
    { label: "Blockchain", type: "text", placeholder: "e.g., Bitcoin, Ethereum, Solana" },
    { label: "Wallet address (public)", type: "text", placeholder: "Public address for identification" },
    { label: "Physical location", type: "text", placeholder: "Where is the hardware wallet stored?" },
    { label: "PIN / passphrase hint", type: "text", placeholder: "A hint — not the actual PIN", sensitive: true },
    { label: "Recovery seed phrase", type: "textarea", placeholder: "24-word recovery phrase", sensitive: true },
    { label: "Notes", type: "textarea", placeholder: "Any additional instructions" },
  ],
  DOMAINS: [
    { label: "Domain name(s)", type: "textarea", placeholder: "One per line: example.com" },
    { label: "Registrar", type: "text", placeholder: "e.g., Namecheap, GoDaddy, Cloudflare" },
    { label: "Login email", type: "text", placeholder: "Email used for registrar account" },
    { label: "Password", type: "text", placeholder: "Registrar account password", sensitive: true },
    { label: "2FA method", type: "text", placeholder: "e.g., Authenticator app, SMS" },
    { label: "Auto-renew status", type: "text", placeholder: "Enabled through [date]" },
    { label: "DNS provider", type: "text", placeholder: "e.g., Cloudflare, Route 53" },
    { label: "Notes", type: "textarea", placeholder: "Transfer instructions, important domains" },
  ],
  FINANCIAL: [
    { label: "Institution", type: "text", placeholder: "e.g., Charles Schwab, Vanguard" },
    { label: "Account type", type: "select", placeholder: "Checking|Savings|Brokerage|401(k)|IRA|Life Insurance|Other" },
    { label: "Account number", type: "text", placeholder: "Account number", sensitive: true },
    { label: "Login email / username", type: "text", placeholder: "Login credentials" },
    { label: "Password", type: "text", placeholder: "Account password", sensitive: true },
    { label: "2FA method", type: "text", placeholder: "e.g., Authenticator, SMS, Security key" },
    { label: "Beneficiary on file", type: "text", placeholder: "Named beneficiary at the institution" },
    { label: "Notes", type: "textarea", placeholder: "Contact info, adviser details" },
  ],
  BUSINESS: [
    { label: "Service name", type: "text", placeholder: "e.g., AWS, Google Workspace, Stripe" },
    { label: "Account role", type: "text", placeholder: "e.g., Root, Admin, Owner" },
    { label: "Login email", type: "text", placeholder: "Email used for this service" },
    { label: "Password", type: "text", placeholder: "Account password", sensitive: true },
    { label: "2FA method", type: "text", placeholder: "e.g., Authenticator, SMS, Security key" },
    { label: "API keys / tokens", type: "textarea", placeholder: "Any API keys or access tokens", sensitive: true },
    { label: "Notes", type: "textarea", placeholder: "Shutdown instructions, team contacts" },
  ],
  IDENTITY: [
    { label: "Document type", type: "select", placeholder: "Passport|SSN|Driver's License|Birth Certificate|Other" },
    { label: "Document number", type: "text", placeholder: "Document number", sensitive: true },
    { label: "Issuing authority", type: "text", placeholder: "e.g., US State Department" },
    { label: "Expiration date", type: "text", placeholder: "MM/YYYY" },
    { label: "Physical location", type: "text", placeholder: "Where is the physical document stored?" },
    { label: "Notes", type: "textarea", placeholder: "Any additional information" },
  ],
  SUBSCRIPTIONS: [
    { label: "Service name", type: "text", placeholder: "e.g., Netflix, Spotify, Adobe" },
    { label: "Plan", type: "text", placeholder: "e.g., Premium Family" },
    { label: "Monthly cost", type: "text", placeholder: "$XX.XX" },
    { label: "Login email", type: "text", placeholder: "Email used for this service" },
    { label: "Password", type: "text", placeholder: "Account password", sensitive: true },
    { label: "Payment method", type: "text", placeholder: "e.g., Visa ending 4242" },
    { label: "Cancellation instructions", type: "textarea", placeholder: "How to cancel if needed" },
  ],
  MESSAGES: [
    { label: "Subject", type: "text", placeholder: "Message subject" },
    { label: "Message", type: "textarea", placeholder: "Write your message here" },
  ],
  DOCUMENTS: [
    { label: "Document name", type: "text", placeholder: "e.g., Family Photos 2020-2026" },
    { label: "Storage location", type: "text", placeholder: "e.g., iCloud, Google Drive, physical safe" },
    { label: "Access instructions", type: "textarea", placeholder: "How to access these files" },
    { label: "Notes", type: "textarea", placeholder: "Any additional context" },
  ],
  OTHER: [
    { label: "Asset name", type: "text", placeholder: "Name of this asset" },
    { label: "Description", type: "textarea", placeholder: "Describe this asset" },
    { label: "Access instructions", type: "textarea", placeholder: "How to access or manage this asset" },
    { label: "Notes", type: "textarea", placeholder: "Any additional information" },
  ],
};

export default function NewAssetPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/assets" className="text-white/40 hover:text-white/60">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-light text-white/88">Add asset</h1>
            <p className="text-sm text-white/55 mt-1">Choose a category to begin documenting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className="card-vault text-left group hover:border-gold/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3 group-hover:bg-gold/10 transition-colors">
                  <Icon className="h-5 w-5 text-white/55 group-hover:text-gold transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-medium text-white/88 group-hover:text-gold transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-white/40 mt-1">{cat.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.value === selectedCategory)!;
  const fields = categoryFields[selectedCategory] || [];
  const Icon = category.icon;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => setSelectedCategory(null)} className="text-white/40 hover:text-white/60">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-light text-white/88">{category.label}</h1>
            <p className="text-xs text-white/55">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 flex items-center gap-3">
        <Lock className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
        <p className="text-xs text-gold">
          All data is encrypted on this device before saving. Fields marked with a lock contain sensitive information.
        </p>
      </div>

      <div className="card-vault space-y-4">
        {fields.map((field, i) => (
          <div key={i}>
            <label className="flex items-center gap-1.5 text-xs text-white/55 mb-1.5">
              {field.sensitive && <Lock className="h-3 w-3 text-gold" aria-hidden="true" />}
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                rows={field.sensitive ? 4 : 3}
                className={`w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none resize-none ${
                  field.sensitive ? "font-mono" : ""
                }`}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
                <option value="">Select...</option>
                {field.placeholder.split("|").map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.sensitive ? "password" : "text"}
                className={`w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none ${
                  field.sensitive ? "font-mono" : ""
                }`}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        {/* File upload */}
        <div>
          <label className="block text-xs text-white/55 mb-1.5">Attachments (optional)</label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-gold/30 transition-colors cursor-pointer">
            <Upload className="h-6 w-6 text-white/20 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-white/40">Drop files here or click to upload</p>
            <p className="text-xs text-white/20 mt-1">Files are encrypted before upload (max 50 MB each)</p>
          </div>
        </div>

        {/* Beneficiary assignment */}
        <div>
          <label className="block text-xs text-white/55 mb-1.5">Assign to beneficiaries</label>
          <div className="space-y-2">
            {["Sarah Mitchell (Spouse)", "James Mitchell (Child)", "Rebecca Torres, Esq. (Attorney)"].map((ben, i) => (
              <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-gold focus:ring-gold/20" />
                <span className="text-sm text-white/70">{ben}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary text-sm">
          <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
          Encrypt & save
        </button>
        <button onClick={() => setSelectedCategory(null)} className="btn-ghost text-sm text-white/55">
          Cancel
        </button>
      </div>
    </div>
  );
}
