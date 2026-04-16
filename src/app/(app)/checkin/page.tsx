"use client";

import React, { useState } from "react";
import { Clock, Check, Shield, Plane, AlertTriangle, Calendar, Settings } from "lucide-react";

export default function CheckinPage() {
  const [interval, setInterval] = useState(30);
  const [travelPause, setTravelPause] = useState(false);
  const [quorum, setQuorum] = useState(2);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const _lastCheckin = "2026-04-04";
  const nextDue = "2026-05-04";
  const daysRemaining = 18;

  const handleCheckin = () => {
    setShowConfirm(true);
  };

  const confirmCheckin = () => {
    setCheckedIn(true);
    setShowConfirm(false);
    setTimeout(() => setCheckedIn(false), 3000);
  };

  const history = [
    { date: "2026-04-04", method: "Manual", status: "confirmed" },
    { date: "2026-03-05", method: "Manual", status: "confirmed" },
    { date: "2026-02-03", method: "Manual", status: "confirmed" },
    { date: "2026-01-04", method: "Manual", status: "confirmed" },
    { date: "2025-12-05", method: "Manual", status: "confirmed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-light text-white/88">Check-in</h1>
        <p className="text-sm text-white/55 mt-1">
          Confirm you are still in control. If you miss a check-in, your trusted people will be notified.
        </p>
      </div>

      {/* Status card */}
      <div className="card-vault border-success/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-success-light" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-white/55">Next check-in due</p>
              <p className="text-2xl font-serif font-light text-white/88">{daysRemaining} days</p>
              <p className="text-xs text-white/40">
                {new Date(nextDue).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
          <button
            onClick={handleCheckin}
            disabled={checkedIn}
            className={`btn-primary text-sm px-8 self-start md:self-center ${checkedIn ? "bg-success" : ""}`}
          >
            {checkedIn ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" aria-hidden="true" />
                Checked in
              </span>
            ) : (
              "Check in now"
            )}
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="card-vault border-gold/30">
          <h2 className="text-sm font-medium text-gold mb-2">Confirm check-in</h2>
          <p className="text-sm text-white/55 mb-4">
            By checking in, you confirm that you are alive, well, and in control of your vault.
            Your next check-in will be due in {interval} days.
          </p>
          <div className="flex gap-3">
            <button onClick={confirmCheckin} className="btn-primary text-sm">
              Confirm
            </button>
            <button onClick={() => setShowConfirm(false)} className="btn-ghost text-sm text-white/55">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interval */}
        <div className="card-vault">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Check-in interval</h2>
          </div>
          <div className="space-y-3">
            <input
              type="range"
              min={7}
              max={90}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full accent-gold"
              aria-label="Check-in interval in days"
            />
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>7 days</span>
              <span className="text-gold font-medium text-sm">{interval} days</span>
              <span>90 days</span>
            </div>
          </div>
        </div>

        {/* Travel pause */}
        <div className="card-vault">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Travel pause</h2>
          </div>
          <p className="text-sm text-white/55 mb-3">
            Temporarily extend your check-in deadline when traveling or unavailable.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelPause(!travelPause)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                travelPause ? "bg-gold" : "bg-white/10"
              }`}
              role="switch"
              aria-checked={travelPause}
              aria-label="Enable travel pause"
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                travelPause ? "translate-x-5" : ""
              }`} />
            </button>
            <span className="text-sm text-white/55">
              {travelPause ? "Active — deadline extended 30 days" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Quorum */}
        <div className="card-vault">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Quorum setting</h2>
          </div>
          <p className="text-sm text-white/55 mb-3">
            How many beneficiaries must confirm before vault access is granted?
          </p>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setQuorum(n)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  quorum === n
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 bg-white/5 text-white/55 hover:border-white/20"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-xs text-white/40">of 3 beneficiaries</span>
          </div>
        </div>

        {/* Notification cascade */}
        <div className="card-vault">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-white/55" aria-hidden="true" />
            <h2 className="text-sm font-medium text-white/88">Notification cascade</h2>
          </div>
          <div className="space-y-3 text-sm text-white/55">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-warning font-mono">1</span>
              </div>
              <p>Email reminder sent to you 3 days before deadline</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-warning font-mono">2</span>
              </div>
              <p>SMS reminder sent to you on deadline day</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-danger font-mono">3</span>
              </div>
              <p>Beneficiaries notified 48 hours after missed deadline</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-danger font-mono">4</span>
              </div>
              <p>Quorum process begins — {quorum} of 3 must confirm to unlock</p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card-vault">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-white/55" aria-hidden="true" />
          <h2 className="text-sm font-medium text-white/88">Check-in history</h2>
        </div>
        <div className="space-y-2">
          {history.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-success-light" aria-hidden="true" />
                </div>
                <span className="text-sm text-white/70">
                  {new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <span className="text-xs text-white/40">{entry.method}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
