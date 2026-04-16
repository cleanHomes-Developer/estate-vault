"use client";

import React from "react";
import { Download, FileText, Video, ExternalLink } from "lucide-react";

const resources = [
  {
    category: "Getting started",
    items: [
      { title: "Partner onboarding guide", type: "PDF", description: "Step-by-step guide to setting up your partner account and inviting clients" },
      { title: "Client onboarding checklist", type: "PDF", description: "A checklist to walk clients through their first vault setup" },
      { title: "Platform walkthrough video", type: "Video", description: "15-minute overview of the platform for new partners" },
    ],
  },
  {
    category: "Legal & compliance",
    items: [
      { title: "RUFADAA overview for Texas attorneys", type: "PDF", description: "Summary of Texas Estates Code Chapter 2001 and digital asset planning" },
      { title: "Exhibit A template", type: "DOCX", description: "Editable template for the digital asset schedule attachment" },
      { title: "Client engagement letter addendum", type: "DOCX", description: "Sample language for adding digital asset services to your engagement letter" },
    ],
  },
  {
    category: "Marketing materials",
    items: [
      { title: "Co-branded presentation deck", type: "PPTX", description: "Customizable slide deck for client presentations" },
      { title: "Email templates", type: "ZIP", description: "Pre-written email sequences for client outreach" },
      { title: "Social media assets", type: "ZIP", description: "LinkedIn and Twitter graphics and copy" },
    ],
  },
  {
    category: "Technical",
    items: [
      { title: "Security whitepaper", type: "PDF", description: "Detailed overview of the zero-knowledge encryption architecture" },
      { title: "API documentation", type: "Link", description: "Partner API for client management and reporting" },
    ],
  },
];

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCX: FileText,
  PPTX: FileText,
  ZIP: Download,
  Video: Video,
  Link: ExternalLink,
};

export default function PartnerResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-light text-ink">Resources</h1>
        <p className="text-sm text-ink-muted mt-1">
          Templates, guides, and marketing materials to grow your practice
        </p>
      </div>

      {resources.map((section) => (
        <div key={section.category}>
          <h2 className="text-sm font-medium text-ink mb-3">{section.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item, i) => {
              const Icon = typeIcons[item.type] || FileText;
              return (
                <div key={i} className="card-marketing group hover:border-gold/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-ink group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ink-muted mt-1">{item.description}</p>
                      <span className="inline-block mt-2 text-xs text-gold font-medium">
                        {item.type === "Link" ? "Open" : "Download"} {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
