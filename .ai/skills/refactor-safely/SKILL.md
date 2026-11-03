---
name: refactor-safely
description: Use when restructuring code without changing its observable behavior.
---

# Refactor Safely

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Define preserved behavior and a narrow refactor scope. Inspect existing changes; do not include unrelated cleanup.
2. Locate callers, imports, public exports and contracts with available graph tooling, then verify current source. No specific MCP tool is required; use targeted source inspection if unavailable.
3. Establish passing baseline tests. Preview renames/moves and impacted paths before editing. Use language-aware rename tooling where available.
4. Change one boundary at a time; preserve API, route, serialization and permission contracts unless explicitly authorized to change them.
5. Run focused tests, typecheck and relevant integration checks; inspect the final diff and update durable architecture notes.

Output: preserved contracts, impact, verification and unresolved risks. Never remove code just because a graph reports no callers: dynamic references may exist. No automatic rollback or user-change deletion.
