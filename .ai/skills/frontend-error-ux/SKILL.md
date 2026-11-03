---
name: frontend-error-ux
description: Use when designing or fixing loading, empty, error and recovery states.
---

Inspect the touched asynchronous flow and its loading, empty, error and data states. Show safe user-facing messages and an actionable retry/recovery path; keep technical detail out of UI. Use inline validation for forms, toasts for nonblocking feedback and a dialog only when the user truly cannot continue. Respect existing i18n.

Use route not-found and crash boundaries where routing/framework supports them. Network loss must not automatically block the whole application: preserve readable cached content and unsaved work. Do not add an offline overlay, modal or global handler to every starter merely to satisfy a checklist. Verify focus, retry behavior and that failures cannot reveal credentials.
