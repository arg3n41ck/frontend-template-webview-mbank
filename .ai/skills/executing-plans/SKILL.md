---
name: executing-plans
description: Use when implementing an existing approved multi-step plan with verification checkpoints.
---

# Executing Plans

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Read the plan, project rules and current source; verify prerequisites and note stale assumptions before editing.
2. Preserve existing user work. Track pending/completed/blocked steps and the checks that prove each one.
3. Execute in dependency order with small patches, using test-driven-development for behavioral changes and focused verification at checkpoints.
4. Delegate only if supported, useful and authorized by the task/rules; sequential execution is a fully supported fallback. No superpowers runtime or named subagent is required.
5. Stop and clarify material scope changes or missing contracts; do not silently redesign the agreed solution. Record partial progress if blocked.
6. Run verification-quality and review-changes before reporting completion; update relevant wiki/technical context only for durable changes.

Output: completed steps, files, exact checks, deviations and remaining work. Do not commit, publish, merge or delete worktrees merely because the plan is finished.
