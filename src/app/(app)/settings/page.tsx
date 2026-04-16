"use client";

import React, { useState } from "react";
import { User, Bell, Globe, Download } from "lucide-react";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("John Mitchell");
  const [email] = useState("john@example.com");
  const [notifications, setNotifications] = useState({
    checkinReminder: true,
    securityAlerts: true,
    productUpdates: false,
    weeklyDigest: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-light text-white/88">Settings</h1>
        <p className="text-sm text-white/55 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Profile</h2>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-white/55 mb-1.5">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/55 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/40 cursor-not-allowed"
            />
            <p className="text-xs text-white/30 mt-1">Contact support to change your email address</p>
          </div>
          <button className="btn-primary text-sm">Save changes</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "checkinReminder", label: "Check-in reminders", description: "Email and SMS reminders before your check-in deadline" },
            { key: "securityAlerts", label: "Security alerts", description: "Notifications about new logins, password changes, and suspicious activity" },
            { key: "productUpdates", label: "Product updates", description: "New features, improvements, and announcements" },
            { key: "weeklyDigest", label: "Weekly digest", description: "A summary of your vault activity and health score" },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between py-2">
              <div>
                <p className="text-sm text-white/70">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                  notifications[item.key as keyof typeof notifications] ? "bg-gold" : "bg-white/10"
                }`}
                role="switch"
                aria-checked={notifications[item.key as keyof typeof notifications]}
                aria-label={item.label}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? "translate-x-5" : ""
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data export */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Data export</h2>
        </div>
        <p className="text-sm text-white/55 mb-4">
          Export all your vault data as an encrypted archive. You will need your master password to decrypt it.
        </p>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm">Export encrypted backup</button>
          <button className="btn-secondary text-sm">Export Exhibit A (PDF)</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Preferences</h2>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-white/55 mb-1.5">Timezone</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/55 mb-1.5">Auto-lock vault</label>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
              <option value="5">After 5 minutes of inactivity</option>
              <option value="15">After 15 minutes of inactivity</option>
              <option value="30">After 30 minutes of inactivity</option>
              <option value="60">After 1 hour of inactivity</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
