"use client";

import React from "react";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, ArrowRight, FileText } from "lucide-react";

const stats = [
  { label: "Active clients", value: "47", change: "+3 this month", icon: Users },
  { label: "Monthly revenue", value: "$658", change: "+12% MoM", icon: DollarSign },
  { label: "Avg. vault health", value: "74", change: "+5 pts", icon: TrendingUp },
];

const recentClients = [
  { name: "Michael Chen", email: "m.chen@example.com", vaultHealth: 92, lastCheckin: "2 days ago", status: "healthy" },
  { name: "Patricia Gonzalez", email: "p.gonzalez@example.com", vaultHealth: 68, lastCheckin: "15 days ago", status: "attention" },
  { name: "Robert Williams", email: "r.williams@example.com", vaultHealth: 45, lastCheckin: "32 days ago", status: "critical" },
  { name: "Jennifer Park", email: "j.park@example.com", vaultHealth: 88, lastCheckin: "5 days ago", status: "healthy" },
  { name: "David Thompson", email: "d.thompson@example.com", vaultHealth: 71, lastCheckin: "12 days ago", status: "attention" },
];

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-ink">Partner Overview</h1>
          <p className="text-sm text-ink-muted mt-1">Torres Law Firm, PLLC</p>
        </div>
        <Link href="/partner/clients" className="btn-primary text-sm inline-flex items-center gap-2 self-start">
          Invite client
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-marketing">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                </div>
                <span className="text-xs text-success font-medium">{stat.change}</span>
              </div>
              <p className="text-3xl font-serif font-light text-ink">{stat.value}</p>
              <p className="text-xs text-ink-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Client health overview */}
      <div className="card-marketing">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-ink">Client vault health</h2>
          <Link href="/partner/clients" className="text-xs text-gold hover:text-gold-hover flex items-center gap-1">
            View all
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Client</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Health</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted hidden sm:table-cell">Last check-in</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client, i) => (
                <tr key={i} className="border-b border-ink/5 last:border-0">
                  <td className="py-3">
                    <p className="font-medium text-ink">{client.name}</p>
                    <p className="text-xs text-ink-muted">{client.email}</p>
                  </td>
                  <td className="py-3">
                    <span className={`font-mono text-sm ${
                      client.vaultHealth >= 80 ? "text-success" : client.vaultHealth >= 60 ? "text-gold" : "text-danger"
                    }`}>
                      {client.vaultHealth}
                    </span>
                  </td>
                  <td className="py-3 text-ink-muted hidden sm:table-cell">{client.lastCheckin}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      client.status === "healthy" ? "bg-success/10 text-success" :
                      client.status === "attention" ? "bg-warning/10 text-warning" :
                      "bg-danger/10 text-danger"
                    }`}>
                      {client.status === "healthy" ? "Healthy" : client.status === "attention" ? "Needs attention" : "Critical"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/partner/exhibit-a" className="card-marketing group hover:border-gold/30 transition-colors flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-gold" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-ink group-hover:text-gold transition-colors">Generate Exhibit A</p>
            <p className="text-xs text-ink-muted mt-0.5">Create a RUFADAA-compliant schedule attachment</p>
          </div>
        </Link>
        <Link href="/partner/resources" className="card-marketing group hover:border-gold/30 transition-colors flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-gold" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-ink group-hover:text-gold transition-colors">Partner resources</p>
            <p className="text-xs text-ink-muted mt-0.5">Templates, guides, and marketing materials</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
