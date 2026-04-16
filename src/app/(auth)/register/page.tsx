"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { passwordStrength } from "@/lib/crypto/vault";
import { Shield, Eye, EyeOff, Check, Copy, ArrowRight, ArrowLeft } from "lucide-react";

type OnboardingStep = "welcome" | "password" | "recovery" | "mfa" | "beneficiary" | "asset" | "complete";

const STEPS: OnboardingStep[] = ["welcome", "password", "recovery", "mfa", "beneficiary", "asset", "complete"];

function getProgress(step: OnboardingStep): number {
  const base = 8; // endowed progress
  const idx = STEPS.indexOf(step);
  return Math.min(100, base + (idx / (STEPS.length - 1)) * (100 - base));
}

export default function RegisterPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [recoveryConfirm, setRecoveryConfirm] = useState("");
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [error, setError] = useState("");

  const strength = passwordStrength(password);
  const progress = getProgress(step);

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
      setError("");
    }
  }, [step]);

  const prevStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
      setError("");
    }
  }, [step]);

  const handlePasswordSubmit = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (strength.score < 2) {
      setError("Please choose a stronger password");
      return;
    }
    // Generate recovery key (mock for UI)
    const mockKey = "ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12-3456";
    setRecoveryKey(mockKey);
    nextStep();
  };

  const handleRecoveryConfirm = () => {
    const lastFour = recoveryKey.slice(-4);
    if (recoveryConfirm !== lastFour) {
      setError(`Please type the last 4 characters of your recovery key: "${lastFour}"`);
      return;
    }
    nextStep();
  };

  const copyRecoveryKey = async () => {
    await navigator.clipboard.writeText(recoveryKey);
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  const strengthColors = ["bg-danger-light", "bg-danger", "bg-warning", "bg-success-light", "bg-success"];
  const strengthWidths = ["w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-parchment-dark">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Shield className="h-8 w-8 text-gold" aria-hidden="true" />
              <span className="font-serif text-2xl font-light text-ink">{brand.name}</span>
            </Link>
          </div>

          {/* Step: Welcome */}
          {step === "welcome" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Begin documenting</h1>
                <p className="body-base text-ink-muted">
                  Create your private vault. Your data will be encrypted on this device
                  before it ever leaves.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-ink mb-1.5">
                    Display name <span className="text-ink-muted">(optional)</span>
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="How you would like to be addressed"
                  />
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={!email}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-center text-sm text-ink-muted">
                Already have an account?{" "}
                <Link href="/login" className="text-gold hover:text-gold-hover font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Step: Master Password */}
          {step === "password" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Create your master password</h1>
                <p className="body-base text-ink-muted">
                  This password encrypts your entire vault. It never leaves your device.
                  If you forget it, only your recovery key can restore access.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                    Master password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 pr-12 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      placeholder="Choose a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 rounded-full bg-parchment-dark overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength.score]} ${strengthWidths[strength.score]}`}
                        />
                      </div>
                      <p className="text-xs text-ink-muted">{strength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-1.5">
                    Confirm master password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Type your password again"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-danger" role="alert">{error}</p>
              )}
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-secondary flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={!password || !confirmPassword}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Recovery Key Ceremony */}
          {step === "recovery" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Your recovery key</h1>
                <p className="body-base text-ink-muted">
                  This is the only way to recover your vault if you forget your master password.
                  Write it down and keep it somewhere safe. It will not be shown again.
                </p>
              </div>
              <div className="rounded-lg border-2 border-gold/30 bg-gold-light/30 p-6">
                <p className="font-mono text-sm text-ink text-center break-all leading-relaxed">
                  {recoveryKey}
                </p>
                <button
                  onClick={copyRecoveryKey}
                  className="mt-4 mx-auto flex items-center gap-2 text-sm text-gold hover:text-gold-hover"
                >
                  {copiedRecovery ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" /> Copy to clipboard
                    </>
                  )}
                </button>
              </div>
              <div>
                <label htmlFor="recoveryConfirm" className="block text-sm font-medium text-ink mb-1.5">
                  Type the last 4 characters of your recovery key to confirm
                </label>
                <input
                  id="recoveryConfirm"
                  type="text"
                  value={recoveryConfirm}
                  onChange={(e) => setRecoveryConfirm(e.target.value)}
                  className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 font-mono text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  placeholder="Last 4 characters"
                  maxLength={4}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-danger" role="alert">{error}</p>
              )}
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-secondary flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={handleRecoveryConfirm}
                  disabled={recoveryConfirm.length !== 4}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I have saved my recovery key
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: MFA Setup */}
          {step === "mfa" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Two-step verification</h1>
                <p className="body-base text-ink-muted">
                  Add an extra layer of protection. Even if someone learns your password,
                  they cannot sign in without your second factor.
                </p>
              </div>
              <div className="space-y-4">
                <button className="w-full card-marketing text-left flex items-start gap-4 hover:border-gold/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">Authenticator app (TOTP)</p>
                    <p className="text-sm text-ink-muted mt-0.5">
                      Use an app like Google Authenticator or Authy to generate time-based codes.
                    </p>
                  </div>
                </button>
                <button className="w-full card-marketing text-left flex items-start gap-4 hover:border-gold/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">Hardware security key (WebAuthn)</p>
                    <p className="text-sm text-ink-muted mt-0.5">
                      Use a YubiKey or similar FIDO2 device for the strongest protection.
                    </p>
                  </div>
                </button>
              </div>
              <div className="rounded-lg bg-parchment-dark p-4">
                <p className="text-xs font-mono text-ink-muted">
                  Backup codes will be generated after setup. You will see them once.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-secondary flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button onClick={nextStep} className="btn-primary flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button onClick={nextStep} className="w-full text-center text-sm text-ink-muted hover:text-ink">
                Set up later
              </button>
            </div>
          )}

          {/* Step: First Beneficiary */}
          {step === "beneficiary" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Add a trusted person</h1>
                <p className="body-base text-ink-muted">
                  Who should receive access to your documented assets if something happens to you?
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="benName" className="block text-sm font-medium text-ink mb-1.5">
                    Their name
                  </label>
                  <input
                    id="benName"
                    type="text"
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label htmlFor="benEmail" className="block text-sm font-medium text-ink mb-1.5">
                    Their email
                  </label>
                  <input
                    id="benEmail"
                    type="email"
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="benRelation" className="block text-sm font-medium text-ink mb-1.5">
                    Relationship
                  </label>
                  <select
                    id="benRelation"
                    className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse / Partner</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="attorney">Attorney</option>
                    <option value="advisor">Financial Adviser</option>
                    <option value="partner">Business Partner</option>
                    <option value="friend">Trusted Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-secondary flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button onClick={nextStep} className="btn-primary flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button onClick={nextStep} className="w-full text-center text-sm text-ink-muted hover:text-ink">
                Add later
              </button>
            </div>
          )}

          {/* Step: First Asset */}
          {step === "asset" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="heading-section text-ink mb-3">Document your first asset</h1>
                <p className="body-base text-ink-muted">
                  What would you like to document first? Everything you enter is encrypted
                  on this device before it is saved.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "₿", label: "Crypto", value: "CRYPTO" },
                  { icon: "🌐", label: "Domains", value: "DOMAINS" },
                  { icon: "🏦", label: "Financial", value: "FINANCIAL" },
                  { icon: "🏢", label: "Business", value: "BUSINESS" },
                  { icon: "🪪", label: "Identity", value: "IDENTITY" },
                  { icon: "📋", label: "Subscriptions", value: "SUBSCRIPTIONS" },
                  { icon: "✉️", label: "Messages", value: "MESSAGES" },
                  { icon: "📄", label: "Documents", value: "DOCUMENTS" },
                  { icon: "📦", label: "Other", value: "OTHER" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    className="card-marketing flex flex-col items-center gap-2 py-4 hover:border-gold/50 transition-colors"
                  >
                    <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                    <span className="text-xs font-medium text-ink">{cat.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-secondary flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button onClick={nextStep} className="btn-primary flex-1">
                  Continue to dashboard
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-success" aria-hidden="true" />
              </div>
              <h1 className="heading-section text-ink">Your vault is ready</h1>
              <p className="body-base text-ink-muted">
                Everything is encrypted and under your control. Begin documenting your digital estate.
              </p>
              <Link href="/dashboard" className="btn-primary w-full inline-flex">
                Open your vault
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
