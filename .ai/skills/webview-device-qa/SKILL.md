---
name: webview-device-qa
description: Use when verifying WebView features or preparing a native release.
---

# webview-device-qa

Read .codex-harness/VERIFICATION.md and docs/NATIVE_HOST.md. Run local focused tests then browser scenarios. Record iOS/Android host app build/OS/engine/minimum, keyboard/insets/header/back/permissions/auth lifecycle evidence. Browser emulation and mocks are not WKWebView/WebView proof. Missing host/device access is an explicit unverified gate, not permission to claim production-ready. Output PASS/FAIL/unverified per contour.
