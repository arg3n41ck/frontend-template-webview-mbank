---
name: verification-quality
description: Use when deciding whether acceptance criteria and verification evidence justify completion.
---

# Verification Quality

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Map each acceptance criterion and important failure mode to a concrete test, check, browser scenario or observed contract.
2. Read project verification guidance and choose impact-based checks: focused tests first, then typecheck/lint/build/integration where relevant.
3. Use verification-before-completion to run fresh commands and collect exact results. Passing a build is not proof of correct UI, authorization or data behavior.
4. Examine missing assertions, mock-only coverage and skipped environments. For risky behavior consider contract/e2e or mutation checks only when the project supports them.
5. Inspect the scoped diff for secrets, unsafe migrations and unrelated changes. Report failing checks and unmet criteria honestly.

Output: criterion-to-evidence summary, exact checks, blockers and residual risk. No invented truth score, arbitrary 0.95 confidence threshold, automatic rollback, watch daemon or Ruflo dependency. Never reset user changes after a failure.
