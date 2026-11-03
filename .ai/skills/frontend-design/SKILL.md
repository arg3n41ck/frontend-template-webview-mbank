---
name: frontend-design
description: Use when designing product screens and composing accessible shadcn UI.
---

Read docs/DESIGN_SYSTEM.md and inspect actual shadcn primitives/theme tokens. Agree on audience, information hierarchy, density, responsive behavior and visual intent before adding product UI. Prefer readable typography, consistent spacing and accessible contrast over novelty.

Compose existing shadcn components; keep their keyboard/focus semantics. Use semantic tokens and Lucide icons, not raw colors or duplicated primitives. Account for loading, empty, error and success states where the feature needs them. Test mobile/desktop and keyboard interaction. A dashboard prioritizes scanning and task efficiency; a marketing page may be more expressive. Do not add animation, dependencies or decorative assets without a real purpose.
