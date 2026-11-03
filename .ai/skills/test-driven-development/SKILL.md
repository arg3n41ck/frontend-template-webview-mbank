---
name: test-driven-development
description: Use when adding testable behavior or fixing a bug, before production code changes.
---

# Test Driven Development

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Read the acceptance criteria, affected source and existing test harness. Choose the smallest observable behavior.
2. Write a focused failing test. Run it and confirm it fails for the intended behavior, not setup/import errors. If it already passes, correct the test or investigate whether the bug exists.
3. Implement the minimum fix, run the test to green, then refactor without changing behavior.
4. Run impacted regression checks. Keep tests focused on behavior rather than implementation details; mock only actual boundaries.
5. For docs/config-only work use appropriate validation instead of artificial tests. If no harness exists, disclose that gap and agree the smallest useful setup; never claim a red-green cycle without observed output.

Output: reproduced failure, fix, exact checks and residual coverage gaps. Never delete existing user code to manufacture a test-first history.
