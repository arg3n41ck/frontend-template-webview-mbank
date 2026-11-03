# MBANK overlay contract

Источник знаний — Anixii/webview-template commit ff003f37fbaa2c01548ca09e1d9da49e3c8a8d06, docs/webview-app-builder/references/mbank-webview-bridge.md и webview-context.md. Guide ссылается на partner docx от 3 июля 2026 и rollout с 3 августа. Это repository evidence, не подтверждение поддержки в конкретном native build.

## Bridge / capabilities

`window.MBankBridge.invoke(type,payload)`, version 1. Только adapter внутри shared/native обращается к global; module UI не вызывает Flutter handler и не строит envelope/nonce самостоятельно.

Native проверяет origin/frame/nonce/version/capabilities; separate dev/test/prod origins и capabilities выдаёт MBANK support. Нет автоматически выданных capabilities. Frontend валидирует shape/URLs, обрабатывает denied/unavailable; это не native authorization.

| Capability | Events |
| --- | --- |
| close | app.close |
| authResume | auth.required |
| payments | payment.start |
| share | share.text |
| pdfPreview | pdf.previewUrl, pdf.previewBase64 |
| analytics | firebaseAnalytics.logEvent, firebaseAnalytics.setUserProperty |
| adjust | adjust.logEvent |
| biometry | biometry.isAvailable, biometry.save, biometry.read |
| deviceReport | device.report |
| externalLinks | external.open |
| deepLinks | deepLink.open |

Typed payload map — shared/native/mbank/eventTypes.ts; runtime schemas — client.ts. Actions facade provides typed `call`, `close`, `requestAuth`, `startPayment`; все events доступны через typed call, не требуется web vendor SDK.

HTTP(S) URL events: parsed exact approved origins, no credentials. Frontend allowlist VITE_MBANK_ALLOWED_ORIGINS не заменяет native allowedOrigins. Deep link schemes default mbank:, иные только по подтверждённому contract. Text limit 100000, base64 PDF limit 5242880 **символов**, не byte-size claim. Проверять actual native/server limits.

Общий transport делает три total discovery attempts с 1sec delay. Invoked command не replay: native response bridgeUnavailable/timeout/error не означает, что предыдущий side effect отсутствовал. Typed errors не содержат raw error.details/token/nonce. Timeouts по умолчанию 15sec; product-specific долгие actions требуют явной policy.

## Auth / guest / session

- Query token/theme/lang сохраняются как launch protocol. До создания Router прочитать credentials и убрать token/customToken из address/history текущей записи. Остальное metadata и fragment сохранить; запретить ранний telemetry/referrer leak в server/native config.
- Скрытие URL на frontend не отменяет уже отправленный HTTP запрос с query credential. Для полного решения нужны backend/native delivery, server logging redaction, Referrer-Policy и CSP; не объявлять frontend scrub полной защитой.
- Host launch theme is authoritative in the bank overlay (including system fallback); a persisted browser theme must not override it. Theme updates during an existing entry require an agreed native callback.
- Auth opt-in VITE_MBANK_AUTH_ENABLED. Token exchange POST /auth/mbank-token, затем GET /auth/me, backend cookies. No auth for GUEST/missing token. auth.required — отдельное explicit user/product action, не замена initial token exchange.
- One-shot bootstrap outside React effects: один POST даже в StrictMode/concurrent consumers; после fail не auto retry/reload. Встроенный Axios timeout ограничивает HTTP ожидание. Refresh endpoint/HttpOnly policy не придуманы; подключать callback только после backend подтверждения.
- Custom token считывается/scrub, но не присоединяется к request без согласованной semantics. Не автоматический is_custom:true.
- Native exit/reopen может создать новый entry session. App suspend может сохранить/уничтожить WebView; sessionStorage не доказательство. Для in-place смены пользователя приложить native callback contract и sessionScope reset; не придумывать callback name.
- Приватный cache не персистить. Статический demo list не является user-scoped API example. Реальные features добавляют session/user/locale keys.

## Payments / privacy / platform

Payment payload содержит serviceId/code, optional string amount/resultUrl/parameters. Не менять финансовый decimal contract и не приводить суммы к float на frontend. Native success не подтверждает backend payment/order; cancel/timeout — unknown until reconciliation. Idempotency и authoritative status принадлежат backend.

Biometry/device report — sensitive capabilities, не складывать их значения в wiki/log/localStorage. Analytics/Adjust events не включать автоматически; consent/redaction согласуются отдельно.

Native header уже есть. Выключение — через MBANK support, не добавлять web header поверх. Safe-area owner и keyboard policy проверить на host build: default config не доказательство отсутствия double padding.

Source bank policy требует запрета zoom. Сохраняется отдельно в bank index viewport с пометкой accessibility exception; не переносить в generic. Native host должен подтвердить фактическое поведение.

Для новых WebView никаких legacy URL/AJAX interception flows. Unknown native events/capabilities не invent. Device release gate включает minimum OS/engine, разрешённые origins, bridge absence/version, auth cancel/return, keyboard, back, lifecycle, payment reconciliation и permissions. Без него не native-production-ready.
