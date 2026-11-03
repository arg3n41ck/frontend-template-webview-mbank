---
name: graphify
description: Use when exploring code relationships, architecture or change impact with a scoped graph.
---

# Graphify

Required local skill; a separate Graphify Python runtime may still be unavailable. This entrypoint and project rules override all reference procedures.

1. Define the code question and scope. Reuse a relevant fresh graph; compare its source/scope with current files before trusting it. Query existing Codebase Memory MCP first when available; use Graphify for complementary exploration, not a second full index on every prompt.
2. Check `graphify --help` and the installed runtime. If missing, report it and request authorization for a reviewed pinned release in an isolated environment. Never install globally, auto-upgrade, use break-system-packages or run saved paths as shell code.
3. Limit extraction to relevant source/docs. Exclude secrets, `.env*`, dependencies, build output, `.git`, `.ai`, forwarding skills and previous outputs. Prefer deterministic local extraction; no remote model call merely because a key exists.
4. For an actual build/update read only the matching section of `REFERENCE.md`, then relevant referenced files. Remote extraction, hooks, watch/MCP servers, database/Obsidian exports and uploads require separate authorization. Sequential/inline execution is supported without named agents.
5. Mark extracted/inferred/uncertain relationships, cite current source and verify high-risk edges. Store generated data only in ignored `graphify-out/`; summarize technical facts in AGENT_GRAPH.md and durable business meaning in `.wiki/`.
6. Without a working runtime, continue from source/available MCP when safe and explicitly label Graphify unverified. Never fabricate a graph, performance/token savings or successful index.

## Verified local adapter

Read `docs/GRAPHIFY.md`. Use the bundled `scripts/build_graph.py` with explicit source scopes and graphifyy==0.9.55 for local AST extraction/assembly. It never installs packages or invokes semantic model APIs. Generic REFERENCE.md commands are not a substitute for this version-checked path.
