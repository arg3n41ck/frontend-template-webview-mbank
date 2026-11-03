---
name: webview-navigation-lifecycle
description: Use when changing WebView back navigation, deep links, resume, auth sessions or async lifecycle.
---

# webview-navigation-lifecycle

Read docs/NATIVE_HOST.md, docs/WEBVIEW_RULES.md, docs/URL_STATE.md. Verify real host callback names; do not invent native resume/back events. Back priority: overlay then router then approved host close/root fallback. Protect drafts, session generation, AbortSignal, cache reset and late callbacks. Verify direct link/subpath/empty history/reopen/cancel. Output contract, cleanup and session/race evidence.
