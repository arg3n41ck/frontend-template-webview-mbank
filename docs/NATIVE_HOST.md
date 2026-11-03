# Native host integration contract

Default host — browser/unconfigured, native actions unavailable. Подключение adapter через `NativeHostContext.Provider` в app composition. Shared transport не импортирует app/modules.

| Область | Frontend | Native / backend owner |
| --- | --- | --- |
| Layout | Shell, один scroller, корректный inset/keyboard policy | Native задаёт container bounds, window insets, header и resize/pan policy |
| Back / lifecycle | Router, overlays, cleanup, session isolation | Native подтверждает реальные callback names, close semantics и resume/reopen |
| Bridge | Typed adapter, payload/error/timeout handling | Native проверяет origin/frame/nonce/version/capabilities и разрешённые schemes |
| Auth | Согласованный session bootstrap, cache reset | Native выдаёт credentials; backend проверяет их, cookie/refresh contract |
| Payments | Explicit user action, pending/unknown state | Native flow + backend idempotency и authoritative payment status |
| Permissions / files | Cancel/denied/error UX, limits, cleanup | Native permission request, file picker/security, download/share policy |
| Deploy | Assets/basepath, safe chunk error UX | Server headers/SPA fallback/HTTPS/CSP; native domain allowlists |

Перед product integration заполнить: host name/build; min iOS engine/Android WebView; ownsInsets; keyboardPolicy; header/back owner; protocol/version; approved domains/capabilities; auth and lifecycle. Пока неизвестно — не считать compatibility подтверждённой.

`NativeBridge` — внутренний frontend port, не обязательный протокол мобильной команды. Adapter преобразует реальный transport в этот интерфейс. Нет bridge version 1 — fail closed; другой protocol требует явного adapter, не обхода guard.

## MBANK profile

Host is MBANK Bridge v1; actual app/engine support remains external verification. Canonical bank-only details in MBANK_CONTRACT.md. Shared/native handles window bridge lookup; app only composes adapters.
