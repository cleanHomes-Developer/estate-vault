"use client";

import React, { useState } from "react";
import { Plus, Search, Mail } from "lucide-react";

const mockClients = [
  { id: "1", name: "Michael Chen", email: "m.chen@example.com", plan: "Personal", health: 92, assets: 18, checkin: "2 days ago", status: "active" },
  { id: "2", name: "Patricia Gonzalez", email: "p.gonzalez@example.com", plan: "Family", health: 68, assets: 12, checkin: "15 days ago", status: "active" },
  { id: "3", name: "Robert Williams", email: "r.williams@example.com", plan: "Personal", health: 45, assets: 8, checkin: "32 days ago", status: "active" },
  { id: "4", name: "Jennifer Park", email: "j.park@example.com", plan: "Family", health: 88, assets: 22, checkin: "5 days ago", status: "active" },
  { id: "5", name: "David Thompson", email: "d.thompson@example.com", plan: "Personal", health: 71, assets: 15, checkin: "12 days ago", status: "active" },
  { id: "6", name: "Lisa Anderson", email: "l.anderson@example.com", plan: "Starter", health: 0, assets: 0, checkin: "Never", status: "invited" },
];

export default function PartnerClientsPage() {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-ink">Clients</h1>
          <p className="text-sm text-ink-muted mt-1">{mockClients.length} clients managed</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Invite client
        </button>
      </div>

      {showInvite && (
        <div className="card-marketing border-gold/30">
          <h2 className="font-medium text-ink mb-4">Invite a new client</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Client name"
              className="rounded-md border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              placeholder="Client email"
              className="rounded-md border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
            />
            <button className="btn-primary text-sm">
              <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
              Send invitation
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full rounded-md border border-ink/20 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
          aria-label="Search clients"
        />
      </div>

      <div className="card-marketing overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left py-3 text-xs font-medium text-ink-muted">Client</th>
              <th className="text-left py-3 text-xs font-medium text-ink-muted hidden md:table-cell">Plan</th>
              <th className="text-left py-3 text-xs font-medium text-ink-muted">Health</th>
              <th className="text-left py-3 text-xs font-medium text-ink-muted hidden sm:table-cell">Assets</th>
              <th className="text-left py-3 text-xs font-medium text-ink-muted hidden md:table-cell">Last check-in</th>
              <th className="text-left py-3 text-xs font-medium text-ink-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id} className="border-b border-ink/5 last:border-0 hover:bg-parchment-dark/50">
                <td className="py-3">
                  <p className="font-medium text-ink">{client.name}</p>
                  <p className="text-xs text-ink-muted">{client.email}</p>
                </td>
                <td className="py-3 text-ink-muted hidden md:table-cell">{client.plan}</td>
                <td className="py-3">
                  <span className={`font-mono ${
                    client.health >= 80 ? "text-success" : client.health >= 60 ? "text-gold" : client.health > 0 ? "text-danger" : "text-ink-muted"
                  }`}>
                    {client.health > 0 ? client.health : "—"}
                  </span>
                </td>
                <td className="py-3 text-ink-muted hidden sm:table-cell">{client.assets}</td>
                <td className="py-3 text-ink-muted hidden md:table-cell">{client.checkin}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    client.status === "active" ? "bg-success/10 text-success" : "bg-gold/10 text-gold"
                  }`}>
                    {client.status === "active" ? "Active" : "Invited"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
