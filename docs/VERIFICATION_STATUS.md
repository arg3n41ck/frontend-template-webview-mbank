# Статус проверок

Дата проверок: 2026-11-03. Source snapshot: `v0.1.0`; native release не подтверждён.

| Проверка | Результат |
| --- | --- |
| Node / package manager | Node 24.18.1 / pnpm 11.21.0 |
| frozen install, --ignore-scripts | PASS |
| pnpm verify | PASS: lint, 3 theme checks, 2 architecture checks, 39 unit/contract tests, TS strict typecheck, production build, AI manifest/adapters |
| pnpm test:browser | PASS: 9 tests; desktop Chromium, mobile Chromium, mobile WebKit |
| pnpm audit + pnpm audit --prod | 0 известных advisories во всём установленном dependency tree на дату проверки |
| AI skills | 46, canonical assets + portable forwarders validated |
| Hub compatibility | PASS на временных Git fixtures: release tag/commit pin, clone, package rename, portable skills, existing-target protection |
| Hub selection | PASS: generic WebView / explicit MBANK / unknown host no-match / existing project no scaffold |
| Code discovery | Оба checkout проиндексированы Codebase Memory MCP, карта проверена по focused graph queries и source |

Browser proof: filters/normalization/reload/unrelated params, unavailable native close, form validation, modal dismissal + focus restoration, horizontal overflow. MBANK дополнительно: URL credential scrub до Router, GUEST без auth, host theme выше stale local preference.

Обнаруженные регрессии получили проверки: abort до dispatch, циклический payload, двойное нажатие/late native rejection после unmount, session reset cancellation, возврат focus после Dialog, MBANK host theme. Был self-review, не независимый аудит.

## Не подтверждено

- Реальные iOS WKWebView / Android app, minimum engine/build, клавиатура/IME, native back/resume/insets, permissions, payment reconciliation и capability allowlist.
- Backend MBANK token/cookie/refresh contract: auth выключен по умолчанию; не выдуман refresh endpoint.
- Remote GitHub CI/deploy: local PASS не подтверждает результат GitHub Actions; проверять workflow для exact source commit. npm/public hub catalog availability не входит в этот source release.
- Права на сторонние материалы требуют отдельного review. Inventory не legal clearance.
- Opt-in shadcn CLI не входит в audit установленного дерева: перед ui:add/ui:check нужны отдельные supply-chain checks, см. DEPENDENCIES.md.

Browser WebKit не заменяет native device QA. Generated проекты не обновляются автоматически. GitHub source repository указан в README/repository URL. Следующий этап распространения через CLI — catalog entry с настоящими release tag/commit pin; он требует отдельного обновления Hub.


## Изменение dependency baseline

Ранее выполненный audit устарел: 2026-11-03 найдено 20 advisories.
После согласованных security updates полный и production audit снова PASS (0).
Версии, область major/minor/patch и upstream evidence: DEPENDENCIES.md.
Приложение и ожидания тестов ради прохождения проверок не упрощались.
