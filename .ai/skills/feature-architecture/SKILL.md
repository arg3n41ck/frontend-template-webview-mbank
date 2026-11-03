---
name: feature-architecture
description: Use when designing module boundaries or adding a cross-module feature.
---

# Feature Architecture

Read docs/ARCHITECTURE.md and .codex-harness/AGENT_GRAPH.md. Locate actual imports with a code graph when available, otherwise targeted source reads. Identify domain ownership, public APIs, composition layer and impacted tests. Keep business code in its owning module; never move domain logic to shared just to avoid an import. Add folders only when there is code.
