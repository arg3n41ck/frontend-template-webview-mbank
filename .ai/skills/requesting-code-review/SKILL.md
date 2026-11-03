---
name: requesting-code-review
description: Use when a substantial change is ready for review or before an authorized merge.
---

# Requesting Code Review

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Prepare a bounded review brief: requirements/non-goals, changed files and exact diff/base, contracts, checks already run, known risks.
2. Use an available reviewer or independent agent when supported and appropriate. No provider-specific tool or fixed agent name is required.
3. If no independent reviewer is available, perform a separate self-review pass and label it self-review; never imply independent approval.
4. Review correctness, security, regressions, maintainability and test coverage. Require concrete file/line evidence for actionable findings.
5. Triage findings with receiving-code-review, fix proven issues and rerun affected checks. Keep unresolved risks visible.

Output: review scope, findings by severity, evidence and verification gaps. Sending external comments, changing PR/MR status, approving or merging requires explicit authorization.
