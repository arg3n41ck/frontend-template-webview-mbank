# Modular architecture contract

Use domain-oriented modules with simple composition, not a mandatory seven-layer framework.

- Frontend layers are canonical: app composition/providers -> framework route boundary -> `modules/<domain>` -> `shared`.
- Route files stay thin. React composition lives in `src/app`; Next.js keeps routes/layouts in `src/app`; TanStack Router files live in `src/pages`. Fullstack applies the same frontend contract inside `apps/web`.
- `modules/<domain>` owns business behavior. Add `ui`, `model`, `api`, and `lib` only when needed; tests stay near behavior.
- `shared/ui/shadcn` contains registry primitives only. Shared hooks, utilities, configuration, styles, and API clients live under their matching `shared/*` folders.
- Dependency direction: app/routes/pages -> modules -> shared. Shared never imports application/domain layers. Module internals are private.
- Other modules may not deep-import internals. Cross-domain scenarios are composed above modules through explicit props/contracts. Do not dump shared business rules into generic utilities.
- Export narrow public APIs. In Next use separate server/client entrypoints; never re-export server secrets or database code through a client barrel.
- TypeScript strictness, clear names, cohesive small functions, existing formatter. No premature memoization, repositories, service layers, empty directories or comments on every trivial field.
- shadcn primitives remain UI-only; product components compose them using semantic tokens.
- Fullstack: modular monolith; backend domain modules need not mirror frontend screen modules. Shared contracts contain serializable transport types only, not ORM entities.

## AI navigation

Start with AGENTS.md -> AGENT_GRAPH.md -> task-specific skill -> actual source -> VERIFICATION.md. Project rules/current source override generic skill examples. Use a code graph if available but never require a proprietary agent runtime. The project must remain usable by a human without AI tooling.

This is a design contract. Preserve the canonical layers and add automated boundary checks when real modules warrant them.
