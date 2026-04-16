# Phase 9: Security Audit

## 1. Dependency Vulnerabilities (pnpm audit)

| Severity | Count | Package | Issue |
|----------|-------|---------|-------|
| High | 3 | next@14.2.35 | Cache poisoning, SSRF in Server Actions, stale cache on 404 |
| Moderate | 3 | next@14.2.35 | Image Optimizer DoS, HTTP request smuggling, disk cache exhaustion |
| Moderate | 1 | @hono/node-server (via prisma) | Middleware bypass via repeated slashes |

**Recommendation:** All Next.js vulnerabilities require upgrading to Next.js 15.x. The Hono vulnerability is in a Prisma dev dependency and does not affect production. For production deployment, upgrade Next.js to 15.5.15+ when ready.

## 2. HTTP Security Headers

| Header | Present | Status |
|--------|---------|--------|
| Content-Security-Policy | NO | MISSING — needs CSP header |
| X-Content-Type-Options | NO | MISSING — should be `nosniff` |
| X-Frame-Options | NO | MISSING — should be `DENY` |
| X-XSS-Protection | NO | MISSING — should be `1; mode=block` |
| Strict-Transport-Security | NO | MISSING — needs HSTS for production |
| Referrer-Policy | NO | MISSING — should be `strict-origin-when-cross-origin` |
| Permissions-Policy | NO | MISSING — should restrict camera/mic/geolocation |
| X-Powered-By | YES (Next.js) | ISSUE — should be removed to reduce fingerprinting |

**Recommendation:** Add security headers via `next.config.mjs` headers configuration.

## 3. Cookie Security

| Attribute | Register Cookie | Status |
|-----------|----------------|--------|
| HttpOnly | YES | PASS |
| Secure | Conditional (prod only) | ACCEPTABLE |
| SameSite | lax | PASS |
| Path | / | PASS |
| MaxAge | 7 days | ACCEPTABLE |

## 4. Cryptographic Implementation Review

| Check | Status | Notes |
|-------|--------|-------|
| Argon2id for key derivation | PASS | 64MB memory, 3 iterations |
| XChaCha20-Poly1305 for symmetric encryption | PASS | AEAD with 192-bit nonce |
| Ciphertext versioning (v1: prefix) | PASS | Enables future migration |
| Random nonce per encryption | PASS | Prevents nonce reuse |
| X25519 for beneficiary key exchange | PASS | crypto_box_seal (anonymous) |
| Secretstream for large files | PASS | Chunked with FINAL tag |
| Memory zeroing after use | PASS | sodium.memzero on sensitive keys |
| SRP-6a implementation | PARTIAL | Uses Argon2id as SRP verifier substitute; production needs proper SRP library |
| Password strength checker | PASS | 0-4 scoring with suggestions |
| Salt generation | PASS | crypto_pwhash_SALTBYTES length |

## 5. Authentication Security

| Check | Status | Notes |
|-------|--------|-------|
| Password never sent to server | PASS | SRP credentials sent instead |
| Session token generation | PASS | crypto.randomUUID() |
| Rate limiting on auth endpoints | MISSING | No rate limiting implemented |
| CSRF protection | PARTIAL | SameSite=lax provides basic protection |
| Input validation | PARTIAL | Basic field presence checks only; no email format, length, or type validation |
| Session invalidation on logout | PASS | Cookie cleared |
| Persistent session storage | MISSING | Session check always returns null user (mock) |

## 6. API Security

| Check | Status | Notes |
|-------|--------|-------|
| HTTP method enforcement | PASS | Next.js App Router only exports POST/GET handlers |
| Error message exposure | CAUTION | Errors logged to console; generic 500 returned |
| Request body size limits | DEFAULT | Uses Next.js default body parser limits |
| CORS configuration | DEFAULT | No explicit CORS; relies on same-origin |

## Summary

- **Critical issues to fix:** Missing security headers, no rate limiting
- **Important issues:** Dependency vulnerabilities (Next.js), input validation gaps
- **Crypto implementation:** Strong — proper algorithms, key hierarchy, memory zeroing
- **Overall security posture:** Good foundation, needs hardening for production
