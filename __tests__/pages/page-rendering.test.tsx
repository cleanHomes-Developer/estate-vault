/**
 * @vitest-environment jsdom
 *
 * Page Rendering Tests
 *
 * Verifies that every page in the application renders without throwing errors.
 * Tests import validation, basic content presence, and structural integrity.
 */

import { describe, it, expect, vi, beforeAll } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation for all page components
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; [key: string]: unknown }) =>
    React.createElement("img", props),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return React.forwardRef(({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<HTMLElement>) =>
        React.createElement(prop as string, { ...props, ref }, children)
      );
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useInView: () => true,
}));

// Mock canvas for ShieldCanvas component
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 0 }),
    canvas: { width: 800, height: 600 },
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "",
    textAlign: "",
    textBaseline: "",
    globalAlpha: 1,
  });
  // Mock requestAnimationFrame
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0);
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
});

describe("Marketing Pages Rendering", () => {
  it("should render the homepage without errors", async () => {
    const { default: HomePage } = await import("../../src/app/(marketing)/page");
    const { container } = render(React.createElement(HomePage));
    expect(container).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(100);
  });

  it("should render the features page without errors", async () => {
    const { default: FeaturesPage } = await import("../../src/app/(marketing)/features/page");
    const { container } = render(React.createElement(FeaturesPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Built for what matters");
  });

  it("should render the security page without errors", async () => {
    const { default: SecurityPage } = await import("../../src/app/(marketing)/security/page");
    const { container } = render(React.createElement(SecurityPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Six layers");
  });

  it("should render the pricing page without errors", async () => {
    const { default: PricingPage } = await import("../../src/app/(marketing)/pricing/page");
    const { container } = render(React.createElement(PricingPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Free");
    expect(container.innerHTML).toContain("Pro");
    expect(container.innerHTML).toContain("Business");
  });

  it("should render the partners page without errors", async () => {
    const { default: PartnersPage } = await import("../../src/app/(marketing)/partners/page");
    const { container } = render(React.createElement(PartnersPage));
    expect(container).toBeTruthy();
  });

  it("should render the journal page without errors", async () => {
    const { default: JournalPage } = await import("../../src/app/(marketing)/journal/page");
    const { container } = render(React.createElement(JournalPage));
    expect(container).toBeTruthy();
  });

  it("should render the FAQ page without errors", async () => {
    const { default: FAQPage } = await import("../../src/app/(marketing)/faq/page");
    const { container } = render(React.createElement(FAQPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Frequently asked questions");
  });
});

describe("Auth Pages Rendering", () => {
  it("should render the login page without errors", async () => {
    const { default: LoginPage } = await import("../../src/app/(auth)/login/page");
    const { container } = render(React.createElement(LoginPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Sign in");
  });

  it("should render the register page without errors", async () => {
    const { default: RegisterPage } = await import("../../src/app/(auth)/register/page");
    const { container } = render(React.createElement(RegisterPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Begin documenting");
  });
});

describe("App Pages Rendering", () => {
  it("should render the dashboard page without errors", async () => {
    const { default: DashboardPage } = await import("../../src/app/(app)/dashboard/page");
    const { container } = render(React.createElement(DashboardPage));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Dashboard");
  });

  it("should render the assets page without errors", async () => {
    const { default: AssetsPage } = await import("../../src/app/(app)/assets/page");
    const { container } = render(React.createElement(AssetsPage));
    expect(container).toBeTruthy();
  });

  it("should render the add asset page without errors", async () => {
    const { default: AddAssetPage } = await import("../../src/app/(app)/assets/new/page");
    const { container } = render(React.createElement(AddAssetPage));
    expect(container).toBeTruthy();
  });

  it("should render the beneficiaries page without errors", async () => {
    const { default: BeneficiariesPage } = await import("../../src/app/(app)/beneficiaries/page");
    const { container } = render(React.createElement(BeneficiariesPage));
    expect(container).toBeTruthy();
  });

  it("should render the simulator page without errors", async () => {
    const { default: SimulatorPage } = await import("../../src/app/(app)/simulator/page");
    const { container } = render(React.createElement(SimulatorPage));
    expect(container).toBeTruthy();
  });

  it("should render the messages page without errors", async () => {
    const { default: MessagesPage } = await import("../../src/app/(app)/messages/page");
    const { container } = render(React.createElement(MessagesPage));
    expect(container).toBeTruthy();
  });

  it("should render the check-in page without errors", async () => {
    const { default: CheckInPage } = await import("../../src/app/(app)/checkin/page");
    const { container } = render(React.createElement(CheckInPage));
    expect(container).toBeTruthy();
  });

  it("should render the vault security page without errors", async () => {
    const { default: VaultSecurityPage } = await import("../../src/app/(app)/vault-security/page");
    const { container } = render(React.createElement(VaultSecurityPage));
    expect(container).toBeTruthy();
  });

  it("should render the subscription page without errors", async () => {
    const { default: SubscriptionPage } = await import("../../src/app/(app)/subscription/page");
    const { container } = render(React.createElement(SubscriptionPage));
    expect(container).toBeTruthy();
  });

  it("should render the settings page without errors", async () => {
    const { default: SettingsPage } = await import("../../src/app/(app)/settings/page");
    const { container } = render(React.createElement(SettingsPage));
    expect(container).toBeTruthy();
  });
});

describe("Partner Pages Rendering", () => {
  it("should render the partner dashboard without errors", async () => {
    const { default: PartnerDashboard } = await import("../../src/app/(partner)/partner/dashboard/page");
    const { container } = render(React.createElement(PartnerDashboard));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Partner Overview");
  });

  it("should render the partner clients page without errors", async () => {
    const { default: PartnerClients } = await import("../../src/app/(partner)/partner/clients/page");
    const { container } = render(React.createElement(PartnerClients));
    expect(container).toBeTruthy();
  });

  it("should render the partner revenue page without errors", async () => {
    const { default: PartnerRevenue } = await import("../../src/app/(partner)/partner/revenue/page");
    const { container } = render(React.createElement(PartnerRevenue));
    expect(container).toBeTruthy();
  });

  it("should render the exhibit A page without errors", async () => {
    const { default: ExhibitA } = await import("../../src/app/(partner)/partner/exhibit-a/page");
    const { container } = render(React.createElement(ExhibitA));
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain("Exhibit A");
  });

  it("should render the partner resources page without errors", async () => {
    const { default: PartnerResources } = await import("../../src/app/(partner)/partner/resources/page");
    const { container } = render(React.createElement(PartnerResources));
    expect(container).toBeTruthy();
  });

  it("should render the partner settings page without errors", async () => {
    const { default: PartnerSettings } = await import("../../src/app/(partner)/partner/settings/page");
    const { container } = render(React.createElement(PartnerSettings));
    expect(container).toBeTruthy();
  });
});

describe("Shared Components Rendering", () => {
  it("should render the marketing header without errors", async () => {
    const { MarketingHeader: Header } = await import("../../src/components/marketing/header");
    const { container } = render(React.createElement(Header));
    expect(container).toBeTruthy();
    expect(container.querySelector("nav") || container.querySelector("header")).toBeTruthy();
  });

  it("should render the marketing footer without errors", async () => {
    const { MarketingFooter: Footer } = await import("../../src/components/marketing/footer");
    const { container } = render(React.createElement(Footer));
    expect(container).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});
