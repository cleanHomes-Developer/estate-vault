"use client";

import React, { useState } from "react";
import { User, CreditCard, Link as LinkIcon, Bell } from "lucide-react";

export default function PartnerSettingsPage() {
  const [firmName, setFirmName] = useState("Torres Law Firm, PLLC");
  const [contactName, setContactName] = useState("Rebecca Torres");
  const [contactEmail, setContactEmail] = useState("rtorres@lawfirm.com");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-serif font-light text-ink">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">Manage your partner account</p>
      </div>

      {/* Firm profile */}
      <div className="card-marketing">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          <h2 className="font-medium text-ink">Firm profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Firm name</label>
            <input
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Primary contact</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <button className="btn-primary text-sm">Save changes</button>
        </div>
      </div>

      {/* Referral link */}
      <div className="card-marketing">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          <h2 className="font-medium text-ink">Referral link</h2>
        </div>
        <p className="text-sm text-ink-muted mb-3">
          Share this link with clients. They will be automatically associated with your partner account.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value="https://app.example.com/r/torres-law"
            readOnly
            className="flex-1 rounded-md border border-ink/20 bg-parchment px-3 py-2.5 text-sm text-ink font-mono"
          />
          <button className="btn-secondary text-sm">Copy</button>
        </div>
      </div>

      {/* Payout settings */}
      <div className="card-marketing">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          <h2 className="font-medium text-ink">Payout settings</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-ink/10">
            <div>
              <p className="text-sm text-ink">Bank account</p>
              <p className="text-xs text-ink-muted">Chase Business ****4821</p>
            </div>
            <button className="text-xs text-gold hover:text-gold-hover">Update</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-ink">Payout schedule</p>
              <p className="text-xs text-ink-muted">Monthly on the 1st</p>
            </div>
            <button className="text-xs text-gold hover:text-gold-hover">Change</button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-marketing">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          <h2 className="font-medium text-ink">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "New client sign-up", description: "When a referred client creates an account" },
            { label: "Client health alerts", description: "When a client's vault health drops below 50" },
            { label: "Payout notifications", description: "When a commission payout is processed" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted">{item.description}</p>
              </div>
              <button
                className="relative w-11 h-6 rounded-full bg-gold transition-colors"
                role="switch"
                aria-checked={true}
                aria-label={item.label}
              >
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white translate-x-5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
