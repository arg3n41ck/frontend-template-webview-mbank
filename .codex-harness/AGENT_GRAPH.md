# WebView technical map

Stack: React 19, TS strict, Vite 8, Tailwind 4/shadcn Radix, TanStack Query/Router, Axios, RHF/Zod. pnpm 11.21.0.

- `src/main.tsx` -> `app/providers/AppProviders` -> `app/App` -> `app/router` -> thin `pages` -> domain `modules`.
- `/`: typed ListSearch -> Home props -> module queryFn local sample. `/form`: DemoForm hook -> RHF/Zod -> shadcn Dialog.
- `shared/ui/webview/WebviewShell` -> `useVisualViewport` -> resize/scroll/focus cleanup and bounded reveal. Config `shared/config/host.ts` owns header/insets/keyboard policy.
- `shared/native/context.tsx`: unavailable default; adapters injected by app. `native/request.ts`: envelope validation, bounded waiting, discovery-only retries. No universal native callback protocol assumed.
- `shared/services/api/client.ts`: Axios, header merge, opt-in injected refresh/session callbacks. `sessionScope.ts`: generation + cancel/clear Query cache. No shared -> modules imports.
- `shared/libs/search-params.ts`: normalized Router-owned filters; no nuqs/Redux.
- `shared/ui/shadcn` registry primitives; `shared/config/styles/palette.css` semantic colors; `components.json` current Radix base.
- `.ai/workflows.json` -> context.mjs -> focused skills; docs/AI_SKILLS.md inventory. `.wiki` business decisions, not duplicate file map.

Technical map refreshed from focused Codebase Memory MCP queries and verified source on 2026-10-05. Home UI -> useNativeClose owns duplicate-click gate and AbortSignal cleanup; shared native request never replays a dispatched command.

Resolve/index this actual checkout with Codebase Memory MCP, not a maintainer-specific ID. Native call shape is verified against source, not graph inference. No graph runtime required for community users. Index is local cache only; do not commit generated DB/runtime artifacts.

Commands and browser/native proof: VERIFICATION.md. Native minimum/app contract: docs/NATIVE_HOST.md. Temporary unfinished context only in ACTIVE_TASKS/tasks.

## MBANK overlay

main imports app/launch before App: launch -> shared/native/mbank/launch -> history replace/token scrub. app/nativeHost composes bank adapter; app/providers passes NativeHostContext and opt-in Session boundary. modules/Session/api/bootstrap owns /auth/mbank-token -> /auth/me once outside React effects. Bank eventTypes/client/windowBridge live in shared/native/mbank. Backend refresh integration is intentionally opt-in/unconfigured. No raw Flutter handler.
