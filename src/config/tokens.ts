/**
 * Design Tokens — Canonical Design System
 *
 * Typography: Cormorant Garamond (serif) + DM Sans (sans) + JetBrains Mono (mono)
 * Marketing: Warm neutral base, deep ink text, aged-gold accent
 * App: Dark base, same accent
 * Voice: Understated, trust-first, British-inflected
 */

export const tokens = {
  fonts: {
    serif: "'Cormorant Garamond', 'Georgia', serif",
    sans: "'DM Sans', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  colors: {
    marketing: {
      background: "#FAF7F2",       // warm parchment
      backgroundAlt: "#F3EDE4",    // slightly deeper parchment
      foreground: "#1A1A1A",       // deep ink
      foregroundMuted: "#6B6459",  // warm grey
      accent: "#B8860B",           // aged gold
      accentHover: "#9A7209",      // darker gold
      accentLight: "#F5E6C8",      // light gold wash
      success: "#2D6A4F",          // muted green
      error: "#9B2C2C",            // muted red
      border: "#E2DDD5",           // warm border
      card: "#FFFFFF",             // card surface
    },
    app: {
      background: "#0F0F0F",       // near-black
      backgroundAlt: "#1A1A1A",    // elevated surface
      backgroundCard: "#222222",   // card surface
      foreground: "rgba(255,255,255,0.88)",  // ~88% opacity
      foregroundMuted: "rgba(255,255,255,0.55)",
      accent: "#B8860B",           // same aged gold
      accentHover: "#D4A017",      // lighter gold on dark
      accentLight: "rgba(184,134,11,0.15)",
      success: "#40916C",
      error: "#E53E3E",
      warning: "#DD6B20",
      border: "rgba(255,255,255,0.1)",
      borderHover: "rgba(255,255,255,0.2)",
    },
    partner: {
      background: "#FAF7F2",       // warm parchment (partner side)
      foreground: "#1A1A1A",
      accent: "#B8860B",
    },
  },

  spacing: {
    section: "6rem",
    sectionMobile: "3rem",
    container: "1200px",
    containerNarrow: "800px",
  },

  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
  },

  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "400ms ease",
  },
} as const;

export type Tokens = typeof tokens;
