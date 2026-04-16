"use client";

import React from "react";
import { DollarSign, TrendingUp, Users, ArrowUp } from "lucide-react";

const monthlyData = [
  { month: "Nov 2025", clients: 38, revenue: 456 },
  { month: "Dec 2025", clients: 40, revenue: 492 },
  { month: "Jan 2026", clients: 42, revenue: 534 },
  { month: "Feb 2026", clients: 43, revenue: 568 },
  { month: "Mar 2026", clients: 44, revenue: 612 },
  { month: "Apr 2026", clients: 47, revenue: 658 },
];

const recentPayouts = [
  { date: "2026-04-01", amount: 658, clients: 47, status: "Paid" },
  { date: "2026-03-01", amount: 612, clients: 44, status: "Paid" },
  { date: "2026-02-01", amount: 568, clients: 43, status: "Paid" },
  { date: "2026-01-01", amount: 534, clients: 42, status: "Paid" },
];

export default function PartnerRevenuePage() {
  const currentRevenue = monthlyData[monthlyData.length - 1].revenue;
  const previousRevenue = monthlyData[monthlyData.length - 2].revenue;
  const growth = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-light text-ink">Revenue</h1>
        <p className="text-sm text-ink-muted mt-1">Track your partner earnings and payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-marketing">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-xs text-ink-muted">This month</span>
          </div>
          <p className="text-3xl font-serif font-light text-ink">${currentRevenue}</p>
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
            {growth}% from last month
          </p>
        </div>
        <div className="card-marketing">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-xs text-ink-muted">Year to date</span>
          </div>
          <p className="text-3xl font-serif font-light text-ink">
            ${monthlyData.slice(-4).reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
          </p>
          <p className="text-xs text-ink-muted mt-1">Jan — Apr 2026</p>
        </div>
        <div className="card-marketing">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-xs text-ink-muted">Revenue per client</span>
          </div>
          <p className="text-3xl font-serif font-light text-ink">
            ${(currentRevenue / monthlyData[monthlyData.length - 1].clients).toFixed(0)}
          </p>
          <p className="text-xs text-ink-muted mt-1">Average monthly</p>
        </div>
      </div>

      {/* Revenue chart (simplified bar chart) */}
      <div className="card-marketing">
        <h2 className="font-medium text-ink mb-6">Monthly revenue</h2>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((m, i) => {
            const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
            const height = (m.revenue / maxRevenue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-ink-muted">${m.revenue}</span>
                <div
                  className="w-full rounded-t-md bg-gold/20 hover:bg-gold/30 transition-colors relative"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-gold"
                    style={{ height: `${Math.min(100, (m.clients / monthlyData[monthlyData.length - 1].clients) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-ink-muted">{m.month.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout history */}
      <div className="card-marketing">
        <h2 className="font-medium text-ink mb-4">Payout history</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Date</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Amount</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Clients</th>
                <th className="text-left py-2 text-xs font-medium text-ink-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayouts.map((payout, i) => (
                <tr key={i} className="border-b border-ink/5 last:border-0">
                  <td className="py-3 text-ink">
                    {new Date(payout.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3 text-ink font-medium">${payout.amount}</td>
                  <td className="py-3 text-ink-muted">{payout.clients}</td>
                  <td className="py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission info */}
      <div className="card-marketing border-gold/20">
        <h2 className="font-medium text-ink mb-2">Commission structure</h2>
        <p className="text-sm text-ink-muted">
          You earn <strong className="text-ink">30% recurring commission</strong> on all client subscriptions
          referred through your partner link. Commissions are paid monthly via direct deposit on the 1st of each month.
        </p>
      </div>
    </div>
  );
}
