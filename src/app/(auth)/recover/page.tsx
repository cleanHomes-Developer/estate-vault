"use client";

import React, { useState } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { Shield, Key, AlertTriangle } from "lucide-react";

export default function RecoverPage() {
  const [step, setStep] = useState<"email" | "key" | "reset">("email");
  const [email, setEmail] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-gold" aria-hidden="true" />
            <span className="font-serif text-xl font-light text-ink">{brand.name}</span>
          </Link>
          <h1 className="text-2xl font-serif font-light text-ink">Account recovery</h1>
          <p className="text-sm text-ink-muted mt-2">
            Use your recovery key to regain access to your vault
          </p>
        </div>

        <div className="card-marketing">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20 mb-6">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-ink">Zero-knowledge recovery</p>
              <p className="text-xs text-ink-muted mt-1">
                Due to our zero-knowledge architecture, we cannot reset your password without your recovery key. 
                If you have lost both your password and recovery key, your vault data cannot be recovered.
              </p>
            </div>
          </div>

          {step === "email" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="recover-email" className="block text-sm font-medium text-ink mb-1.5">
                  Email address
                </label>
                <input
                  id="recover-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
              </div>
              <button
                onClick={() => setStep("key")}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          )}

          {step === "key" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="recovery-key" className="block text-sm font-medium text-ink mb-1.5">
                  Recovery key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" aria-hidden="true" />
                  <input
                    id="recovery-key"
                    type="text"
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="Enter your 24-word recovery key"
                    className="w-full rounded-md border border-ink/20 bg-white pl-10 pr-4 py-2.5 text-sm text-ink font-mono placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
                  />
                </div>
                <p className="text-xs text-ink-muted mt-1.5">
                  This is the key you saved during account registration.
                </p>
              </div>
              <button
                onClick={() => setStep("reset")}
                className="btn-primary w-full"
              >
                Verify recovery key
              </button>
              <button
                onClick={() => setStep("email")}
                className="btn-ghost w-full"
              >
                Back
              </button>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-center">
                <p className="text-sm text-success font-medium">Recovery key verified</p>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-ink mb-1.5">
                  New master password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong master password"
                  className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-ink mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
              </div>
              <button className="btn-primary w-full">
                Reset password & re-encrypt vault
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-gold hover:text-gold-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
