# MBANK WebView Starter

Независимый React-шаблон для WebView внутри MBANK. Общая архитектура и WebView safeguards совпадают с `frontend-template-webview`; отдельно добавлены Bridge v1, безопасный launch context и opt-in backend session bootstrap.

## Запуск

Node 24.x и pnpm 11.21.0:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
pnpm verify
pnpm exec playwright install chromium webkit
pnpm test:browser
```

`/` — sample list/URL filters; `/form` — локальная RHF/Zod-форма и overlay. Без real API демо работает. Без native bridge закрытие/прочие native actions **не подтверждают успех**.

## Подключение к MBANK

1. Получите подтверждённые app build/engine minimums, origins и capabilities у MBANK. Native header уже учтён, но inset/keyboard policy нужно сверить с host.
2. В `.env` задайте публичный `VITE_API_BASE_URL`; после backend-подтверждения включите `VITE_MBANK_AUTH_ENABLED=true`. Auth endpoint `/auth/mbank-token`, cookie session, `/auth/me` сохраняются из source-контракта.
3. `token/customToken` читаются **один раз до router/telemetry**, удаляются из query через replace и остаются только в памяти launch. `theme/lang` и прочие metadata сохраняются. Не включайте telemetry до scrub.
4. `GUEST`/нет token не вызывает backend auth и не запускает native auth автоматически. Защищённый сценарий явно вызывает `createMbankActions(host).requestAuth()`.
5. Native calls через `shared/native/mbank/client.ts`. Capabilities и реальную origin/nonce проверку обеспечивает MBANK, не frontend.
6. Перед релизом выполните native device checklist. Payment bridge success — не статус оплаченного заказа.

Auth bootstrap one-shot: StrictMode/конкурентные потребители не повторяют token POST, ошибка требует безопасно переоткрыть сервис. Refresh не включён автоматически: backend-контракт refresh/HttpOnly cookies нужно согласовать, затем использовать injected session callbacks transport. `customToken` не превращается в выдуманный auth-flow.

## Preview и ограничения

`VITE_ENABLE_MBANK_MOCK=true` — только явный development preview. Production его игнорирует. URL `mbankBridge=mock` не включает preview. Payment/auth/close/biometry storage не получают fake success даже в preview.

Реальный bridge отсутствует/версия неверна/permission запрещён — typed error. Timeout/abort ограничивает JS ожидание, не отменяет уже начатую native операцию; автоматический payment replay запрещён.

MBANK-source требует блокировки zoom; это отдельное bank-specific исключение с accessibility risk, не общая WebView рекомендация. Meta viewport не доказывает полную блокировку на каждом host. Native app должен подтвердить поведение. Modern CSS stack требует Safari-engine 16.4+/Chromium111+, а реальные MBANK minimums ещё не подтверждены.

## ИИ и документация

46 project-local on-demand skills: общий family kit, четыре WebView skills, `mbank-bridge-contract`, `mbank-session-payments`. Canonical `.ai/skills`, adapters `.agents/.claude/.codex`. Graphify и wiki включены; global runtime не нужен.

```sh
node .ai/context.mjs --check
node .ai/context.mjs --task feature --risk mbank --risk keyboard
```

Читайте `AGENTS.md`, `docs/MBANK_CONTRACT.md`, `docs/WEBVIEW_RULES.md`, `docs/NATIVE_HOST.md`, `.codex-harness/VERIFICATION.md`. `docs/PROVENANCE.md` фиксирует исходный Anixii и общую базу. Исходный репозиторий не изменён. Source release — `v0.1.0` в этом репозитории. Включение в Hub — отдельный catalog release; созданные проекты не обновляются автоматически.


## Проверки релиза

`docs/VERIFICATION_STATUS.md` — свежие local checks и непроверенные native gates.
`docs/DEPENDENCIES.md` — security baseline. Публичный исходник и зелёный browser
smoke не означают подтверждённую готовность конкретного native host.
