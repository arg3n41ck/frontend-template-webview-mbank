---
name: webview-layout-keyboard
description: Use when changing WebView layout, keyboard, safe areas, scrolling, forms or overlays.
---

# webview-layout-keyboard

Read docs/WEBVIEW_RULES.md and host.ts. Identify single inset and keyboard compensation owner; no double padding. Inspect shell and primitive overlay consumers, test visualViewport resize/scroll/scale fallback and cleanup. Never blur/remount form on resize or use universal UA workaround. Check input in overlay, native back, orientation, long text, focus return. Output browser proof separately from required iOS/Android host evidence.
