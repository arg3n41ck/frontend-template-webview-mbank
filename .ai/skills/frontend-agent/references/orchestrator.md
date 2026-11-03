# Frontend Orchestrator — case detection & ordered skill routing

This is the **entry brain** of `frontend-agent`. Its job: look at the prompt, classify it into
exactly ONE primary case, then invoke the **minimal ordered set** of skills for that case —
one at a time, in sequence — instead of firing every frontend skill at once.

> Rule of economy: never load more than the case needs. A "fix padding" task must NOT pull in
> ui-ux-pro-max + design-system-steward + frontend-design. A "design a dashboard" task should.

## How to use (procedure)

1. **Classify.** Read the prompt (+ any named files) and match it to the FIRST row of the table
   below whose triggers fit. Pick ONE primary case. If two genuinely apply, pick the one whose
   *outcome* the user asked for; note the secondary and handle it after.
2. **Announce.** Say: `Frontend case: <case> → skills: <ordered list>`. This is the visible signal
   the user asked for — they see which case won and what will run.
3. **Run the chain in order.** Invoke each skill with the Skill tool, one at a time, completing
   its step before the next. Do NOT batch. Stop early if the task is satisfied.
4. **Always-on rails (every case):** the non-bending rules from `react-senior-standard.md`, and —
   for any non-trivial build/edit — dispatch the `frontend-engineer` subagent so work is visible.
5. **DESIGN GATE (mandatory for ANY case that touches visible UI — cases 1, 2, 3, 5, 6, 7, 8, 10, 11, 12):**
   before writing or editing UI code:
   a. If `docs/frontend/design.md` exists — read it and code strictly to its tokens (palette, fonts,
      spacing, radii, shadows). Do NOT invent colors/fonts/styles from memory.
   b. If it does NOT exist (or lacks tokens) — actually RUN the ui-ux-pro-max engine (reading the
      SKILL.md alone is NOT enough):
      Skills live in the project OR in the global install (`~/.claude/skills`), so resolve first:
      `S="$([ -d .ai/skills/ui-ux-pro-max ] && echo .ai/skills || echo "$HOME/.claude/skills")"`
      `python3 "$S/ui-ux-pro-max/scripts/search.py" "<product type, e.g. saas dashboard>" --design-system`
      Optional dials: `--variance 1-10` (layout boldness), `--motion 1-10` (adds a matching GSAP
      snippet), `--density 1-10` (spacing scale). Add `--persist` to write `design-system/MASTER.md`.
      Pick the recommended pattern/style/palette/font pairing, record them in `docs/frontend/design.md`
      (via `design-system-steward`), THEN code to them.
   c. Generic gray-Tailwind output with default `slate/gray` + system font and no defined style is a
      FAILED gate — redo against the recorded design system.
6. **Verify:** `pnpm lint && pnpm typecheck && pnpm test`; fix anything `frontend-lint.sh` reports.

## Case → ordered skill chain

| # | Case | Triggers (RU/EN) | Ordered skills to invoke |
|---|------|------------------|--------------------------|
| 1 | **New UI from scratch** (component/page/screen/dashboard) | «сделай/создай компонент/страницу/экран/дашборд», build/create UI, new screen | `brainstorming` → `feature-architecture` (if a module/route) → `frontend-design` → `ui-ux-pro-max` (**RUN** `scripts/search.py "<product type>" --design-system`, apply its palette/fonts/style) → `frontend-agent` (code, test-first) → `design-system-steward` (record new tokens) |
| 2 | **Design system / tokens** | «дизайн-система, токены, палитра, типографика, spacing, тема», design.md, palette, tokens | `design-system-steward` → `ui-ux-pro-max` (**RUN** `scripts/search.py`) |
| 3 | **Error / edge states** | «404, error, ошибка, offline, оффлайн, краш, пустой экран, loading, retry», error boundary, crash fallback | `frontend-error-ux` → `frontend-agent` |
| 4 | **UI bug / defect** | «баг, не работает, сломалось, fix, regression, почему», unexpected behavior | `systematic-debugging` → `react-19-patterns` → (`typescript-react-routing` if routing) |
| 5 | **Routing / navigation** | «роут, маршрут, навигация, ссылка, deep-link, router», TanStack Router, App Router | `typescript-react-routing` (Vite) OR `nextjs-app-router-practices` (Next) → `frontend-agent` |
| 6 | **Forms & validation** | «форма, валидация, инпут, submit», React Hook Form, Zod | `react-19-patterns` → `frontend-agent` (Zod = source of truth) |
| 7 | **Performance** | «тормозит, ре-рендеры, медленно, оптимизируй, memo, bundle», Core Web Vitals | `react-19-patterns` → `frontend-agent` (perf checklist) |
| 8 | **Architecture / module structure** | «архитектура, структура, модуль, границы, рефактор слоёв, FSD» | `feature-architecture` → `frontend-agent` (modular-architecture refs) |
| 9 | **Review / audit** | «ревью, проверь, аудит, code review, PR» | `review-changes` (local) OR `review-pr` (PR) → `code-reviewer` |
| 10 | **Accessibility** | «a11y, доступность, screen reader, ARIA, клавиатура, контраст» | `ui-ux-pro-max` (a11y) → `frontend-agent` |
| 11 | **Next.js specifics** | «Next.js, App Router, SSR, RSC, server component, метаданные» | `nextjs-app-router-practices` → `frontend-agent` |
| 12 | **Small local edit** (trivial) | «поправь отступ/цвет/текст/один пропс», one-liner, rename | `frontend-agent` ONLY (no companions). Just apply it under the rails. |

## Multi-step builds

If the task is a multi-step build (case 1 or 8 at scale), after classification route through the
Superpowers process chain first: `brainstorming` → `writing-plans` → `executing-plans`, then
re-enter this table per sub-task. Behaviour-changing work also runs `behaviour-harness`.

## Disambiguation heuristics

- "make it look better / redesign" → case 1/2 (design), NOT case 4 (bug).
- "add a loading spinner / empty state" → case 3 (error/edge states), NOT case 1.
- "the button does nothing when clicked" → case 4 (bug), NOT case 1.
- Mentions a specific stack word (TanStack/App Router/Zod) → jump to that stack case (5/6/11).
- If truly ambiguous and a wrong guess is costly, ask ONE targeted question; otherwise pick the
  best case and state the assumption.
