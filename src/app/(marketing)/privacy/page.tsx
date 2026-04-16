"use client";

import React from "react";
import { brand } from "@/config/brand";

export default function PrivacyPage() {
  return (
    <div className="container-narrow section-padding">
      <h1 className="heading-display text-ink mb-8">Privacy Policy</h1>
      <p className="text-sm text-ink-muted mb-12">Last updated: April 2026</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="heading-card text-ink mb-4">1. Introduction</h2>
          <p className="body-base text-ink-muted">
            {brand.legalEntity} (&quot;{brand.name},&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            digital estate vault service.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">2. Zero-Knowledge Architecture</h2>
          <p className="body-base text-ink-muted">
            Our service is built on a zero-knowledge encryption architecture. This means that your vault data is encrypted 
            on your device before it reaches our servers. We cannot access, read, or decrypt your vault contents. Your 
            master password never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">3. Information We Collect</h2>
          <p className="body-base text-ink-muted mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2 text-ink-muted">
            <li><strong className="text-ink">Account information:</strong> Email address, display name, and billing information for subscription management.</li>
            <li><strong className="text-ink">Encrypted vault data:</strong> Stored in encrypted form that we cannot decrypt.</li>
            <li><strong className="text-ink">Usage metadata:</strong> Login timestamps, check-in activity, and feature usage for service improvement.</li>
            <li><strong className="text-ink">Device information:</strong> Browser type, operating system, and IP address for security purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">4. How We Use Your Information</h2>
          <p className="body-base text-ink-muted">
            We use your information to provide and maintain the service, process transactions, send check-in reminders, 
            detect and prevent fraud, and comply with legal obligations. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">5. Data Retention</h2>
          <p className="body-base text-ink-muted">
            We retain your encrypted vault data for as long as your account is active. Upon account deletion, all data 
            is permanently removed within 30 days. Backup copies are purged within 90 days.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">6. RUFADAA Compliance</h2>
          <p className="body-base text-ink-muted">
            Our service is designed to comply with the Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA), 
            specifically Texas Estates Code Chapter 2001. We facilitate the lawful transfer of digital assets to designated 
            beneficiaries and fiduciaries.
          </p>
        </section>

        <section>
          <h2 className="heading-card text-ink mb-4">7. Contact Us</h2>
          <p className="body-base text-ink-muted">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:privacy@${brand.domain}`} className="text-gold hover:text-gold-hover">
              privacy@{brand.domain}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
