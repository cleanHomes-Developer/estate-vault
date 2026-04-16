"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, FileText, Mic, Video } from "lucide-react";

const mockMessages = [
  {
    id: "1", subject: "For Sarah — if I am not here", type: "written" as const,
    recipient: "Sarah Mitchell", trigger: "check-in-failure",
    preview: "My dearest Sarah, if you are reading this, it means I was unable to check in...",
    createdAt: "2026-02-15", updatedAt: "2026-03-01",
  },
  {
    id: "2", subject: "Account passwords and instructions", type: "written" as const,
    recipient: "Sarah Mitchell", trigger: "check-in-failure",
    preview: "Here are the steps to access our joint accounts and important documents...",
    createdAt: "2026-02-20", updatedAt: "2026-03-05",
  },
  {
    id: "3", subject: "For James — when you are ready", type: "written" as const,
    recipient: "James Mitchell", trigger: "check-in-failure",
    preview: "Son, there are things I want you to know about our family and the decisions I made...",
    createdAt: "2026-03-01", updatedAt: "2026-03-01",
  },
  {
    id: "4", subject: "Birthday message for James", type: "audio" as const,
    recipient: "James Mitchell", trigger: "date:2027-06-15",
    preview: "Audio recording — 3:42",
    createdAt: "2026-03-10", updatedAt: "2026-03-10",
  },
];

const typeIcons = { written: FileText, audio: Mic, video: Video };

export default function MessagesPage() {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-light text-white/88">Messages</h1>
          <p className="text-sm text-white/55 mt-1">
            Personal messages for your trusted people, delivered when the time comes
          </p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New message
        </button>
      </div>

      {/* Compose form */}
      {showCompose && (
        <div className="card-vault border-gold/20">
          <h2 className="text-sm font-medium text-white/88 mb-4">Compose message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/55 mb-1.5">Recipient</label>
                <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
                  <option value="">Select recipient</option>
                  <option value="1">Sarah Mitchell (Spouse)</option>
                  <option value="2">James Mitchell (Child)</option>
                  <option value="3">Rebecca Torres, Esq. (Attorney)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/55 mb-1.5">Delivery trigger</label>
                <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 focus:border-gold/50 focus:outline-none">
                  <option value="check-in-failure">On check-in failure</option>
                  <option value="date">On a specific date</option>
                  <option value="asset-access">When a specific asset is accessed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Subject</label>
              <input
                type="text"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
                placeholder="Message subject"
              />
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Message type</label>
              <div className="flex gap-3">
                {[
                  { type: "written", icon: FileText, label: "Written" },
                  { type: "audio", icon: Mic, label: "Audio" },
                  { type: "video", icon: Video, label: "Video" },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.type}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/55 hover:border-gold/30 hover:text-gold transition-colors"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/55 mb-1.5">Message</label>
              <textarea
                rows={6}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/88 placeholder:text-white/30 focus:border-gold/50 focus:outline-none resize-none"
                placeholder="Write your message here. It will be encrypted before saving."
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-sm">Save & encrypt</button>
              <button onClick={() => setShowCompose(false)} className="btn-ghost text-sm text-white/55">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-3">
        {mockMessages.map((msg) => {
          const TypeIcon = typeIcons[msg.type];
          return (
            <div key={msg.id} className="card-vault group hover:border-gold/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TypeIcon className="h-4 w-4 text-white/55" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-white/88">{msg.subject}</h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        To: {msg.recipient} &middot; Trigger: {msg.trigger === "check-in-failure" ? "Check-in failure" : msg.trigger}
                      </p>
                    </div>
                    <span className="text-xs text-white/30 flex-shrink-0">
                      Updated {new Date(msg.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-white/55 mt-2 italic">&ldquo;{msg.preview}&rdquo;</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mockMessages.length === 0 && (
        <div className="card-vault text-center py-12">
          <MessageSquare className="h-12 w-12 text-white/10 mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-white/55">No messages yet</p>
          <p className="text-xs text-white/30 mt-1">Create a message for your trusted people</p>
        </div>
      )}
    </div>
  );
}
