---
name: webview-native-contract
description: Use when integrating native bridge actions, permissions, links or host capabilities.
---

# webview-native-contract

Read docs/NATIVE_HOST.md and docs/WEBVIEW_RULES.md. Verify real protocol, minimum engine, owner and native security enforcement before code. Inspect shared/native; feature code never invokes raw host globals. Fail closed for unavailable/version/payload/capability errors. Bounded waiting is not native cancellation; never auto replay commands. Validate payload/URL/PII redaction and explicit dev mock boundary. Output contract, changed owners, tests and native gaps.
