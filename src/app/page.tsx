/**
 * Root page renders the marketing homepage with header and footer.
 * Since this page is outside the (marketing) route group,
 * we need to include the layout components explicitly.
 */
import React from "react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import MarketingHomePage from "./(marketing)/page";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink">
      <MarketingHeader />
      <main>
        <MarketingHomePage />
      </main>
      <MarketingFooter />
    </div>
  );
}
