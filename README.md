# Estate Vault — Digital Estate Planning Platform

A zero-knowledge digital estate vault that helps individuals document their digital assets and pass them on to trusted people through a controlled, cryptographically-enforced process.

## Architecture

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + design tokens |
| Database | PostgreSQL via Prisma ORM |
| Cryptography | libsodium (Argon2id, XChaCha20-Poly1305, X25519) |
| Auth Protocol | SRP-6a (zero-knowledge password proof) |
| Testing | Vitest |

## Brand Configuration

The product name is stored in a single configuration file:

```
src/config/brand.ts
```

When the product name is finalized, update **only this file**. Every component, page, and metadata reference imports from here. No find-and-replace is required.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/      # 7 public marketing pages (light theme)
│   ├── (auth)/            # Login & registration (dark theme)
│   ├── (app)/             # 10 authenticated app screens (dark theme)
│   ├── (partner)/         # Partner portal (light theme)
│   └── api/auth/          # Auth API routes
├── components/
│   └── marketing/         # Shared marketing components
├── config/
│   ├── brand.ts           # Single source of truth for product name
│   ├── tokens.ts          # Design tokens
│   └── copy.ts            # Voice & copy guidelines
├── lib/
│   ├── crypto/vault.ts    # Zero-knowledge cryptographic core
│   ├── auth/              # Auth context & state management
│   └── utils/             # Utility functions
prisma/
└── schema.prisma          # Full database schema
```

## Cryptographic Architecture

The vault uses a **three-key hierarchy**:

1. **Master Key** — Derived from the user's password via Argon2id
2. **Vault Key** — Random 256-bit key encrypted by the Master Key
3. **Per-Asset Keys** — Each asset has its own encryption key, wrapped by the Vault Key

All encryption uses **XChaCha20-Poly1305** (AEAD). Key exchange with beneficiaries uses **X25519**.

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm dev
pnpm test
```

## License

Proprietary. All rights reserved.
