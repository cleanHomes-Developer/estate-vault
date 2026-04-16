"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, FolderOpen, Shield, Clock, Mail, Phone, Key } from "lucide-react";

const mockBeneficiaries: Record<string, {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  status: string;
  assets: { name: string; category: string; access: string }[];
  addedAt: string;
  lastNotified: string;
}> = {
  "1": {
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    relationship: "Spouse",
    status: "verified",
    assets: [
      { name: "Bitcoin Wallet (Ledger Nano X)", category: "Crypto", access: "Full access" },
      { name: "Ethereum Wallet (MetaMask)", category: "Crypto", access: "Full access" },
      { name: "AWS Root Account", category: "Business", access: "Full access" },
      { name: "Family Photos (iCloud)", category: "Documents", access: "Full access" },
      { name: "Life Insurance Policy", category: "Financial", access: "Full access" },
      { name: "Vanguard 401(k)", category: "Financial", access: "Full access" },
    ],
    addedAt: "October 2025",
    lastNotified: "Never",
  },
  "2": {
    name: "James Mitchell",
    email: "james@example.com",
    phone: "+1 (555) 345-6789",
    relationship: "Brother",
    status: "verified",
    assets: [
      { name: "Bitcoin Wallet (Ledger Nano X)", category: "Crypto", access: "View only" },
      { name: "Domain Portfolio (Namecheap)", category: "Domains", access: "Full access" },
      { name: "AWS Root Account", category: "Business", access: "View only" },
      { name: "Family Photos (iCloud)", category: "Documents", access: "Full access" },
    ],
    addedAt: "November 2025",
    lastNotified: "Never",
  },
  "3": {
    name: "Torres Law Firm",
    email: "rtorres@lawfirm.com",
    phone: "+1 (555) 456-7890",
    relationship: "Estate Attorney",
    status: "verified",
    assets: [
      { name: "Family Photos (iCloud)", category: "Documents", access: "View only" },
    ],
    addedAt: "December 2025",
    lastNotified: "Never",
  },
};

export default function BeneficiaryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const beneficiary = mockBeneficiaries[id];

  if (!beneficiary) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-serif text-white/88 mb-4">Beneficiary not found</h1>
        <Link href="/beneficiaries" className="btn-primary text-sm">Back to Beneficiaries</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/beneficiaries" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-gold">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Beneficiaries
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-serif text-gold">{beneficiary.name.charAt(0)}</span>
        </div>
        <div>
          <h1 className="text-xl font-serif font-light text-white/88">{beneficiary.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/55">{beneficiary.relationship}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              beneficiary.status === "verified"
                ? "bg-success/10 text-success-light"
                : "bg-warning/10 text-warning"
            }`}>
              {beneficiary.status === "verified" ? "Verified" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Contact information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-white/30" aria-hidden="true" />
            <span className="text-sm text-white/70">{beneficiary.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-white/30" aria-hidden="true" />
            <span className="text-sm text-white/70">{beneficiary.phone}</span>
          </div>
        </div>
      </div>

      {/* Assigned assets */}
      <div className="card-vault">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Assigned assets ({beneficiary.assets.length})</h2>
          </div>
          <button className="text-xs text-gold hover:text-gold-hover">Assign asset</button>
        </div>
        <div className="divide-y divide-white/5">
          {beneficiary.assets.map((asset, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-white/88">{asset.name}</p>
                <p className="text-xs text-white/40">{asset.category}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                asset.access === "Full access"
                  ? "bg-gold/10 text-gold"
                  : "bg-white/5 text-white/55"
              }`}>
                {asset.access}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Encryption info */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Key exchange</h2>
        </div>
        <p className="text-sm text-white/55 mb-3">
          Asset keys are encrypted with this beneficiary&apos;s X25519 public key. They can only decrypt 
          assets specifically assigned to them.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-white/40">Public key</p>
            <p className="text-white/70 font-mono text-xs">x25519:a1b2...f8e9</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Key exchange</p>
            <p className="text-white/70">Verified</p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Details</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-white/40">Added</p>
            <p className="text-white/70">{beneficiary.addedAt}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Last notified</p>
            <p className="text-white/70">{beneficiary.lastNotified}</p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Activity</h2>
        </div>
        <div className="space-y-3">
          {[
            { action: "Identity verified", time: beneficiary.addedAt },
            { action: "Key exchange completed", time: beneficiary.addedAt },
            { action: "Beneficiary added", time: beneficiary.addedAt },
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
