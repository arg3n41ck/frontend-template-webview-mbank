---
name: mbank-bridge-contract
description: Use when implementing or debugging MBANK native events, capabilities, URLs or bridge errors.
---

# mbank-bridge-contract

Read docs/MBANK_CONTRACT.md and common native safeguards. Verify exact bank events/payload/capability/origin/version against partner contract, not memory. Only shared native adapter touches globals; no Flutter handler or legacy URL interception. Frontend validation does not grant capabilities. Typed errors, limits, no production mock success, no raw details logs and no replay on timeout. Report code/tests separately from real host proof.
