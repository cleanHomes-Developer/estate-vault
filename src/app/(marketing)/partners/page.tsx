"use client";

import React, { useState } from "react";
import { brand } from "@/config/brand";
import { DollarSign, Users, FileText, Shield, Check, ArrowRight } from "lucide-react";

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    firmName: "",
    contactName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    state: "TX",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-marketing text-center">
          <p className="label-mono text-gold mb-4">Partner programme</p>
          <h1 className="heading-display text-ink max-w-3xl mx-auto mb-6">
            Bring digital estate planning to your practice
          </h1>
          <p className="body-large text-ink-muted max-w-2xl mx-auto">
            {brand.name} is designed for Texas estate attorneys and financial advisers.
            Offer your clients a modern solution for documenting digital assets — under your own brand.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-20">
        <div className="container-marketing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "20% revenue share",
                description: "Earn recurring revenue for every client you onboard. Paid monthly, no caps.",
              },
              {
                icon: Users,
                title: "Partner portal",
                description: "Monitor client vault health, manage onboarding, and access professional resources.",
              },
              {
                icon: FileText,
                title: "Exhibit A templates",
                description: "Pre-formatted schedule attachments for Texas wills under RUFADAA Chapter 2001.",
              },
              {
                icon: Shield,
                title: "White-label onboarding",
                description: "Clients see your firm's name and branding throughout the onboarding experience.",
              },
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="card-marketing">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium text-ink mb-2">{benefit.title}</h3>
                  <p className="text-sm text-ink-muted">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="section-padding bg-parchment-dark">
        <div className="container-marketing max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="heading-section text-ink">How the partnership works</h2>
          </div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Apply", description: "Complete the application form below. We review all applications within 48 hours." },
              { step: "02", title: "Onboard", description: "Receive your partner portal credentials, white-label configuration, and Exhibit A templates." },
              { step: "03", title: "Invite clients", description: "Onboard clients under your firm's brand. They document their digital assets in their private vault." },
              { step: "04", title: "Earn", description: "Receive 20% of each client's subscription fee, paid monthly. No caps, no clawbacks." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-xs text-gold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-medium text-ink">{item.title}</h3>
                  <p className="text-sm text-ink-muted mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section-padding">
        <div className="container-marketing max-w-xl">
          <div className="text-center mb-12">
            <h2 className="heading-section text-ink">Apply to partner</h2>
            <p className="body-base text-ink-muted mt-4">
              Currently accepting applications from licensed practitioners in Texas.
            </p>
          </div>

          {submitted ? (
            <div className="card-marketing text-center py-12">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-success" aria-hidden="true" />
              </div>
              <h3 className="heading-card text-ink mb-2">Application received</h3>
              <p className="text-sm text-ink-muted">
                We will review your application and respond within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-marketing space-y-4">
              <div>
                <label htmlFor="firmName" className="block text-sm font-medium text-ink mb-1.5">
                  Firm name
                </label>
                <input
                  id="firmName"
                  type="text"
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-ink mb-1.5">
                  Contact name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="partnerEmail" className="block text-sm font-medium text-ink mb-1.5">
                  Email
                </label>
                <input
                  id="partnerEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-ink mb-1.5">
                  License / Bar number
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-ink mb-1.5">
                  State
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  <option value="TX">Texas</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full mt-4">
                Submit application
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
