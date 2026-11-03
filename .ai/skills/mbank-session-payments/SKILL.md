---
name: mbank-session-payments
description: Use when changing MBANK token/guest/cookie authentication, session isolation or payment flows.
---

# mbank-session-payments

Read docs/MBANK_CONTRACT.md and source Session/bootstrap. Token/customToken scrub before Router/telemetry; preserve preferences/unrelated params. GUEST/missing token never auto-auth. StrictMode/concurrency share one exchange; do not retry consumed credentials. Refresh/HttpOnly needs backend contract. Session reset cancels/clears private cache and rejects late results. Payment success is server-owned, timeout may have performed an action; require reconciliation/idempotency before replay. No secret/token/user PII logging. Output backend/native ownership and regression/device evidence.
