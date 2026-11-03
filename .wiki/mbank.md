# MBANK decisions

Bank overlay only. Source partner guide remains repository-level evidence; actual supported app build/engine and issued capabilities must be confirmed by mobile/backend owners.

Guest does not auto-auth. Credentials consumed once before router, no persisted token. Auth/refresh cookies are backend-owned. Bridge timeout cannot authorize payment replay. Native header and zoom exception are bank-specific, not generic rules.

Canonical contract: ../docs/MBANK_CONTRACT.md. Common rules: ../docs/WEBVIEW_RULES.md.
