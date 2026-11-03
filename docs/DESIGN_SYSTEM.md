# Design system

- shadcn/ui is the primitive source baseline; Radix provides behavior and Lucide provides standard icons.
- `src/shared/config/styles/palette.css` is the single color source of truth: primitive brand/neutral/status values map to light/dark semantic tokens. `global.css` only exposes those semantics to Tailwind.
- Product code consumes classes such as `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-success`, `bg-warning` and `bg-info`; generated registry components inherit the project palette automatically.
- Raw palette utilities such as `bg-yellow-500`, `text-white` or `bg-black/50` are forbidden inside registry primitives. Use or introduce a semantic token instead; `pnpm test:theme` enforces this contract.
- `src/shared/ui/shadcn` contains registry primitives only. Reusable product compositions belong outside that folder; feature-specific UI stays with the feature.
- The curated ready baseline is `accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `input`, `label`, `pagination`, `popover`, `progress`, `radio-group`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`.
- Add uncommon primitives only when needed with `pnpm ui:add <component>`. Preview the registry diff with `pnpm ui:check <component>`. The repository pins the shadcn CLI; do not use `@latest` in normal project work.
- Do not install the entire registry by default: unused TypeScript is normally tree-shaken from JavaScript, but every source file can still contribute detected Tailwind utilities to generated CSS.
- New screens must cover responsive layout, keyboard/focus behavior, loading, empty, error and destructive states.
- Before writing a custom interactive primitive, check the local baseline and the shadcn registry. Product-specific compositions remain product code.
