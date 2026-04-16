"use client";

import React, { useState } from "react";
import { FileText, Download, Check, ChevronDown,  Shield } from "lucide-react";
import { brand } from "@/config/brand";

const mockClients = [
  { id: "1", name: "Michael Chen", assets: 18, lastUpdated: "2026-04-10" },
  { id: "2", name: "Patricia Gonzalez", assets: 12, lastUpdated: "2026-04-08" },
  { id: "3", name: "Robert Williams", assets: 8, lastUpdated: "2026-03-20" },
  { id: "4", name: "Jennifer Park", assets: 22, lastUpdated: "2026-04-12" },
];

export default function ExhibitAPage() {
  const [selectedClient, setSelectedClient] = useState("");
  const [includeCategories, setIncludeCategories] = useState({
    crypto: true,
    domains: true,
    financial: true,
    business: true,
    identity: true,
    subscriptions: true,
    documents: true,
    other: true,
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif font-light text-ink">Exhibit A Generator</h1>
        <p className="text-sm text-ink-muted mt-1">
          Generate a RUFADAA Chapter 2001 compliant schedule attachment for a Texas will
        </p>
      </div>

      {/* Info card */}
      <div className="rounded-lg border border-gold/30 bg-gold-light/30 px-4 py-3 flex items-start gap-3">
        <Shield className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="text-sm text-ink-muted">
          <p className="font-medium text-ink mb-1">About Exhibit A</p>
          <p>
            This document is formatted as a schedule attachment to a Texas will under the
            Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA), Texas Estates Code
            Chapter 2001. It provides a structured inventory of the client&apos;s digital assets
            for integration into their estate plan.
          </p>
        </div>
      </div>

      {/* Client selector */}
      <div className="card-marketing">
        <h2 className="font-medium text-ink mb-4">Select client</h2>
        <div className="relative">
          <select
            value={selectedClient}
            onChange={(e) => { setSelectedClient(e.target.value); setGenerated(false); }}
            className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 pr-10 text-ink appearance-none focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            aria-label="Select client"
          >
            <option value="">Choose a client...</option>
            {mockClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.assets} assets (updated {new Date(client.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Category selection */}
      {selectedClient && (
        <div className="card-marketing">
          <h2 className="font-medium text-ink mb-4">Include categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(includeCategories).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() =>
                    setIncludeCategories((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                  }
                  className="rounded border-ink/20 text-gold focus:ring-gold/20"
                />
                <span className="text-sm text-ink capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {selectedClient && (
        <div className="card-marketing">
          <h2 className="font-medium text-ink mb-4">Document preview</h2>
          <div className="rounded-lg border border-ink/10 bg-white p-6 md:p-8 font-serif">
            <div className="text-center mb-8">
              <p className="text-xs text-ink-muted uppercase tracking-wider">Exhibit A</p>
              <h3 className="text-lg font-light text-ink mt-2">
                Schedule of Digital Assets
              </h3>
              <p className="text-sm text-ink-muted mt-1">
                Pursuant to Texas Estates Code, Chapter 2001 (RUFADAA)
              </p>
            </div>
            <div className="space-y-4 text-sm text-ink-muted">
              <div className="grid grid-cols-2 gap-4 border-b border-ink/10 pb-4">
                <div>
                  <p className="text-xs text-ink-muted">Testator</p>
                  <p className="text-ink font-medium">{mockClients.find((c) => c.id === selectedClient)?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Date prepared</p>
                  <p className="text-ink">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Prepared by</p>
                  <p className="text-ink">Torres Law Firm, PLLC</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Platform</p>
                  <p className="text-ink">{brand.name}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-ink mb-2">I. Cryptocurrency & Digital Wallets</h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ink/10">
                      <th className="text-left py-1 text-ink-muted">Asset</th>
                      <th className="text-left py-1 text-ink-muted">Type</th>
                      <th className="text-left py-1 text-ink-muted">Designated Beneficiary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ink/5">
                      <td className="py-1.5">Bitcoin Wallet (Ledger)</td>
                      <td className="py-1.5">Hardware wallet</td>
                      <td className="py-1.5">Sarah Chen</td>
                    </tr>
                    <tr className="border-b border-ink/5">
                      <td className="py-1.5">Ethereum Wallet (MetaMask)</td>
                      <td className="py-1.5">Software wallet</td>
                      <td className="py-1.5">Sarah Chen</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-medium text-ink mb-2">II. Financial Accounts</h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ink/10">
                      <th className="text-left py-1 text-ink-muted">Institution</th>
                      <th className="text-left py-1 text-ink-muted">Account Type</th>
                      <th className="text-left py-1 text-ink-muted">Designated Beneficiary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ink/5">
                      <td className="py-1.5">Charles Schwab</td>
                      <td className="py-1.5">Brokerage</td>
                      <td className="py-1.5">Sarah Chen</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-ink/10 text-xs text-ink-muted">
                <p>
                  This schedule is intended to be attached as Exhibit A to the Last Will and
                  Testament of the above-named Testator. Access credentials and sensitive
                  information are stored in an encrypted digital vault maintained by {brand.name} and
                  are accessible only through the designated beneficiary key exchange process.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate button */}
      {selectedClient && (
        <div className="flex gap-3">
          {!generated ? (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating PDF...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Generate Exhibit A PDF
                </span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button className="btn-primary text-sm flex items-center gap-2">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF
              </button>
              <span className="flex items-center gap-1 text-sm text-success">
                <Check className="h-4 w-4" aria-hidden="true" />
                Generated successfully
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
