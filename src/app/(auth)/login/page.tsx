"use client";

import React, { useState } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { Shield, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [step, _setStep] = useState<"credentials" | "mfa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In production: full SRP-6a handshake
      // For now, simulate login
      await new Promise((r) => setTimeout(r, 1000));
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-gold" aria-hidden="true" />
            <span className="font-serif text-2xl font-light text-ink">{brand.name}</span>
          </Link>
        </div>

        {step === "credentials" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="heading-section text-ink mb-3">Welcome back</h1>
              <p className="body-base text-ink-muted">
                Sign in to access your vault. Your password never leaves this device.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  autoComplete="email"
                />
              </div>
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
                    placeholder="Your master password"
                    required
                    autoComplete="current-password"
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
              </div>

              {error && (
                <p className="text-sm text-danger" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 animate-pulse" aria-hidden="true" />
                    Unlocking vault...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </button>
            </form>

            <div className="text-center space-y-2">
              <Link href="/recover" className="text-sm text-gold hover:text-gold-hover font-medium">
                Forgot your password? Use recovery key
              </Link>
              <p className="text-sm text-ink-muted">
                No account?{" "}
                <Link href="/register" className="text-gold hover:text-gold-hover font-medium">
                  Begin documenting
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === "mfa" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="heading-section text-ink mb-3">Two-step verification</h1>
              <p className="body-base text-ink-muted">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-ink mb-1.5">
                Verification code
              </label>
              <input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="000000"
                required
                autoFocus
              />
            </div>
            <button className="btn-primary w-full">
              Verify
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </button>
            <button className="w-full text-center text-sm text-ink-muted hover:text-ink">
              Use a backup code instead
            </button>
          </div>
        )}

        {/* Security notice */}
        <div className="mt-8 rounded-lg bg-parchment-dark p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-4 w-4 text-ink-muted mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-ink-muted leading-relaxed">
              Your password is used to derive an encryption key on this device. It is never
              transmitted to our servers. Authentication uses the SRP-6a protocol, which
              verifies your identity without revealing your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
