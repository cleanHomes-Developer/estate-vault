"use client";

import React, { useState } from "react";
import { Shield, Fingerprint, Key, Smartphone, Clock, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [mfaEnabled, _setMfaEnabled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-light text-white/88">Security</h1>
        <p className="text-sm text-white/55 mt-1">
          Manage your master password, two-factor authentication, and active sessions
        </p>
      </div>

      {/* Master Password */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-gold" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Master password</h2>
        </div>
        <p className="text-sm text-white/55 mb-4">
          Your master password encrypts your vault. Changing it will re-encrypt your vault key.
        </p>
        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            className="btn-secondary text-sm"
          >
            Change master password
          </button>
        ) : (
          <div className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Current password</label>
              <input
                type="password"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">New password</label>
              <input
                type="password"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Confirm new password</label>
              <input
                type="password"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-sm">Update password</button>
              <button onClick={() => setShowChangePassword(false)} className="btn-ghost text-sm text-white/55">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="card-vault">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Two-factor authentication</h2>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            mfaEnabled ? "bg-success/10 text-success-light" : "bg-warning/10 text-warning"
          }`}>
            {mfaEnabled ? "Enabled" : "Not enabled"}
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
            <Smartphone className="h-5 w-5 text-white/55 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white/88">Authenticator app (TOTP)</p>
              <p className="text-xs text-white/40 mt-0.5">
                Use Google Authenticator, Authy, or any TOTP-compatible app.
              </p>
            </div>
            <button className="btn-secondary text-xs">
              {mfaEnabled ? "Manage" : "Set up"}
            </button>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
            <Fingerprint className="h-5 w-5 text-white/55 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white/88">Hardware security key (WebAuthn)</p>
              <p className="text-xs text-white/40 mt-0.5">
                Use a YubiKey or similar FIDO2 device for the strongest protection.
              </p>
            </div>
            <button className="btn-secondary text-xs">Set up</button>
          </div>
        </div>
      </div>

      {/* Recovery Key */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-gold" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Recovery key</h2>
        </div>
        <p className="text-sm text-white/55 mb-4">
          Your recovery key is the only way to regain access if you forget your master password.
          It was shown once during registration. You can generate a new one, which will invalidate the old one.
        </p>
        <button className="btn-secondary text-sm">
          Generate new recovery key
        </button>
      </div>

      {/* Active Sessions */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Active sessions</h2>
        </div>
        <div className="space-y-3">
          {[
            { device: "Chrome on macOS", location: "Austin, TX", current: true, lastActive: "Now" },
            { device: "Safari on iPhone", location: "Austin, TX", current: false, lastActive: "2 hours ago" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm text-white/70">{session.device}</p>
                <p className="text-xs text-white/40">{session.location} &middot; {session.lastActive}</p>
              </div>
              {session.current ? (
                <span className="text-xs text-success-light font-medium">Current</span>
              ) : (
                <button className="text-xs text-danger hover:text-danger-light">Revoke</button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 text-xs text-danger hover:text-danger-light">
          Revoke all other sessions
        </button>
      </div>

      {/* Danger zone */}
      <div className="card-vault border-danger/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
          <h2 className="text-sm font-medium text-danger">Danger zone</h2>
        </div>
        <p className="text-sm text-white/55 mb-4">
          Deleting your account will permanently destroy all encrypted data, keys, and messages.
          This action cannot be undone.
        </p>
        <button className="px-4 py-2 rounded-lg border border-danger/30 text-sm text-danger hover:bg-danger/10 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  );
}
