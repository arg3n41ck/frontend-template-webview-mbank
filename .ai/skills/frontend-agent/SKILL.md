---
name: frontend-agent
description: Use when implementing a frontend task within this project.
---

Read AGENTS.md, docs/ARCHITECTURE.md, docs/DESIGN_SYSTEM.md and the relevant part of the source map. The installed package.json and lockfile decide framework versions and tools; never upgrade or install a router/state library just because a skill suggests it.

Choose only the required workflow: project-kickoff for unclear product scope; feature-architecture for boundaries; framework skill for version-specific APIs; UI/UX skills for design; systematic-debugging for failures; review-changes and verification-before-completion at the finish.

Keep route/page wrappers thin and domain UI/model/API together. Reuse existing shadcn primitives, semantic tokens and icon libraries. Match existing formatter/type conventions. Tests must cover changed behavior; do not require arbitrary comments, folder counts, file-length cutoffs or a particular linter. React 18 CRM must not use React 19-only APIs. Next server and client exports remain separate.

Read legacy references only as optional background; when they conflict, AGENTS.md, docs/ARCHITECTURE.md and current source win. Do not load the whole reference library or companion skills automatically.
