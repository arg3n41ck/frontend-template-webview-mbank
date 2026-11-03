---
name: receiving-code-review
description: Use when evaluating review feedback before implementing suggested changes.
---

# Receiving Code Review

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Read the whole finding and restate the claimed behavior, risk and expected correction.
2. Verify it against current code, requirements, API contracts and tests. Ask for clarification when the proposed outcome is ambiguous.
3. Reproduce valid defects with a focused test when possible. Push back with evidence on incorrect or out-of-scope suggestions rather than blindly agreeing.
4. Prioritize correctness/security issues, apply small independent fixes and rerun impacted checks after each meaningful change.
5. Report which findings were fixed, rejected with reasons, or remain unresolved. Never claim a fix based only on editing a file.

Use review-changes for the actual diff inspection; this skill handles feedback decisions. Do not post external replies or resolve discussions without authorization.
