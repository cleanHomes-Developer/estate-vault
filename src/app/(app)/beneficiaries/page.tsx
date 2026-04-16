"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Mail, Phone, Shield, FolderOpen, ArrowRight } from "lucide-react";

const mockBeneficiaries = [
  {
    id: "1", name: "Sarah Mitchell", email: "sarah@example.com", phone: "+1 (512) 555-0101",
    relationship: "Spouse", status: "active", assetsAssigned: 8, invitedAt: "2026-01-15",
    hasAccepted: true,
  },
  {
    id: "2", name: "James Mitchell", email: "james@example.com", phone: "+1 (512) 555-0102",
    relationship: "Child", status: "active", assetsAssigned: 4, invitedAt: "2026-02-01",
    hasAccepted: true,
  },
  {
    id: "3", name: "Rebecca Torres, Esq.", email: "rtorres@lawfirm.com", phone: "+1 (214) 555-0200",
    relationship: "Attorney", status: "pending", assetsAssigned: 12, invitedAt: "2026-03-10",
    hasAccepted: false,
  },
];

export default function BeneficiariesPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-white/88">Beneficiaries</h1>
          <p className="text-sm text-white/55 mt-1">People you trust with your digital estate</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add person
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card-vault border-gold/20">
          <h2 className="text-sm font-medium text-white/88 mb-4">Invite a trusted person</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Full name</label>
              <input
                type="text"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
                placeholder="Their full name"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Relationship</label>
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
                <option value="">Select relationship</option>
                <option value="spouse">Spouse / Partner</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="attorney">Attorney</option>
                <option value="advisor">Financial Adviser</option>
                <option value="partner">Business Partner</option>
                <option value="friend">Trusted Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary text-sm">Send invitation</button>
            <button onClick={() => setShowInvite(false)} className="btn-ghost text-sm text-white/55">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Beneficiary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBeneficiaries.map((ben) => (
          <div key={ben.id} className="card-vault group hover:border-gold/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-sm font-medium text-gold">
                  {ben.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                ben.hasAccepted
                  ? "bg-success/10 text-success-light"
                  : "bg-warning/10 text-warning"
              }`}>
                {ben.hasAccepted ? "Active" : "Pending"}
              </span>
            </div>
            <h3 className="text-sm font-medium text-white/88">{ben.name}</h3>
            <p className="text-xs text-white/40 mt-0.5">{ben.relationship}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/55">
                <Mail className="h-3 w-3" aria-hidden="true" />
                {ben.email}
              </div>
              {ben.phone && (
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  {ben.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-white/55">
                <FolderOpen className="h-3 w-3" aria-hidden="true" />
                {ben.assetsAssigned} assets assigned
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <Link href={`/beneficiaries/${ben.id}`} className="text-xs text-gold hover:text-gold-hover flex items-center gap-1">
                Manage
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
              <Link href={`/simulator?beneficiary=${ben.id}`} className="text-xs text-white/40 hover:text-white/60">
                Preview their view
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="card-vault border-white/10">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm text-white/70">
              Each beneficiary receives a unique cryptographic key pair. When you assign an asset,
              the per-asset key is re-encrypted specifically for that beneficiary. They can only
              decrypt assets assigned to them — never your full vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
