"use client";

import React from "react";
import { brand } from "@/config/brand";

export default function TermsPage() {
  return (
    <div className="container-narrow section-padding">
      <h1 className="heading-display text-ink mb-8">Terms of Service</h1>
      <p className="text-sm text-ink-muted mb-12">Last updated: April 2026</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="heading-card text-ink mb-4">1. Acceptance of Terms</h2>
          <p className="body-base text-ink-muted">
            By accessing or using {brand.name} (the &quot;Service&quot;), operated by {brand.legalEntity}, you agree to be 
            bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">2. Description of Service</h2>
          <p className="body-base text-ink-muted">
            {brand.name} is a zero-knowledge digital estate vault that allows users to securely document, encrypt, and 
            organize digital assets with designated beneficiaries. The Service includes encrypted storage, beneficiary 
            management, check-in verification, and estate planning tools.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">3. User Responsibilities</h2>
          <p className="body-base text-ink-muted mb-4">As a user of the Service, you are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2 text-ink-muted">
            <li>Maintaining the security of your master password and recovery key.</li>
            <li>Ensuring the accuracy of information stored in your vault.</li>
            <li>Responding to check-in prompts within the configured timeframe.</li>
            <li>Keeping your beneficiary designations up to date.</li>
            <li>Complying with all applicable laws regarding digital asset management.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">4. Zero-Knowledge Limitation</h2>
          <p className="body-base text-ink-muted">
            Due to our zero-knowledge architecture, we cannot recover your vault data if you lose both your master 
            password and recovery key. You acknowledge and accept this limitation as an inherent feature of our 
            security model.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">5. Subscription and Billing</h2>
          <p className="body-base text-ink-muted">
            The Service offers free and paid subscription tiers. Paid subscriptions are billed monthly or annually. 
            You may cancel at any time, and your subscription will remain active until the end of the current billing 
            period. Refunds are provided in accordance with our refund policy.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">6. Limitation of Liability</h2>
          <p className="body-base text-ink-muted">
            {brand.name} is a documentation and encryption tool, not a legal service. We do not provide legal, financial, 
            or tax advice. Users should consult qualified professionals for estate planning decisions. The Service is 
            provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">7. Governing Law</h2>
          <p className="body-base text-ink-muted">
            These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without 
            regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">8. Contact</h2>
          <p className="body-base text-ink-muted">
            For questions about these Terms, contact us at{" "}
            <a href={`mailto:legal@${brand.domain}`} className="text-gold hover:text-gold-hover">
              legal@{brand.domain}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
