# Verification

Choose checks by impact. Never equate browser WebKit with native WKWebView.

- Dependencies/architecture/transport: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm verify`, `pnpm audit --prod`, `pnpm audit`.
- Core contracts: `pnpm test`; boundaries: `pnpm test:boundaries`; tokens: `pnpm test:theme`.
- Skills: `node .ai/context.mjs --check`, `--task feature --risk native --risk keyboard`; no executing arbitrary docs commands.
- Browser: `pnpm exec playwright install chromium webkit`, `pnpm test:browser`. Test runner owns its loopback server (127.0.0.1:4179). Do not start shared/production hosts. `/`, `/form`, filters/reload/unrelated params, native unavailable, validation, modal/focus restoration, overflow at desktop and mobile widths; add viewport/keyboard-policy tests for changes.
- CI uses Node24, frozen install/ignored hooks, verify/audit/browser. Local PASS is not proof remote CI ran.

## Native release gate (unverified until recorded)

Test min + current iOS/WKWebView and Android host engine: keyboard show/hide/back, drawer input, native gestures, landscape, notch/insets zero/nonzero, header ownership, font scaling, app suspend/reopen, bridge readiness/version/capabilities, auth cancel and permissions.

Record host app build, OS/engine, policy, route, expected/actual and evidence. Android inset behavior changed by engine milestone; do not assume Chrome mobile equals WebView. Mock success cannot satisfy this gate. Payments require backend reconciliation and no replay proof.

Without native test contour the starter can be locally verified, but is not declared native-production-ready. Rollback: revert our scoped changes/tag/catalog pin; do not overwrite downstream user projects.
