"use client";

import React from "react";
import { CreditCard, Check } from "lucide-react";

export default function SubscriptionPage() {
  const currentPlan = "Personal";
  // const billingCycle = "annual";
  const nextBilling = "2027-01-15";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-light text-white/88">Subscription</h1>
        <p className="text-sm text-white/55 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current plan */}
      <div className="card-vault border-gold/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-white/40">Current plan</p>
            <p className="text-xl font-serif font-light text-gold mt-1">{currentPlan}</p>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success-light">
            Active
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-white/40">Billing</p>
            <p className="text-sm text-white/70 mt-0.5">Annual</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Price</p>
            <p className="text-sm text-white/70 mt-0.5">$7/month</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Next billing</p>
            <p className="text-sm text-white/70 mt-0.5">
              {new Date(nextBilling).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40">Assets</p>
            <p className="text-sm text-white/70 mt-0.5">12 of 50</p>
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            name: "Starter",
            price: 0,
            features: ["5 assets", "1 beneficiary", "Basic check-in", "Zero-knowledge encryption"],
            current: false,
          },
          {
            name: "Personal",
            price: 7,
            features: ["50 assets", "5 beneficiaries", "Full check-in system", "Vault simulator", "Personal messages", "Priority support"],
            current: true,
          },
          {
            name: "Family",
            price: 18,
            features: ["Unlimited assets", "Unlimited beneficiaries", "All Personal features", "Exhibit A export", "Family sharing", "Dedicated support"],
            current: false,
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className={`card-vault ${plan.current ? "border-gold/30" : ""}`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/88">{plan.name}</h3>
              <p className="text-2xl font-serif font-light text-white/88 mt-1">
                ${plan.price}
                {plan.price > 0 && <span className="text-xs text-white/40">/mo</span>}
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-success-light mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-white/55">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.current ? (
              <span className="block text-center text-xs text-gold font-medium py-2">Current plan</span>
            ) : (
              <button className="btn-secondary text-xs w-full">
                {plan.price > 7 ? "Upgrade" : plan.price === 0 ? "Downgrade" : "Switch"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment method */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Payment method</h2>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 rounded bg-white/10 flex items-center justify-center">
              <span className="text-xs text-white/55 font-mono">VISA</span>
            </div>
            <div>
              <p className="text-sm text-white/70">Visa ending in 4242</p>
              <p className="text-xs text-white/40">Expires 12/2028</p>
            </div>
          </div>
          <button className="text-xs text-gold hover:text-gold-hover">Update</button>
        </div>
      </div>

      {/* Billing history */}
      <div className="card-vault">
        <h2 className="text-sm font-medium text-white/88 mb-4">Billing history</h2>
        <div className="space-y-2">
          {[
            { date: "2026-01-15", amount: "$84.00", description: "Annual subscription — Personal", status: "Paid" },
            { date: "2025-01-15", amount: "$84.00", description: "Annual subscription — Personal", status: "Paid" },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm text-white/70">{invoice.description}</p>
                <p className="text-xs text-white/40">
                  {new Date(invoice.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">{invoice.amount}</p>
                <p className="text-xs text-success-light">{invoice.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
