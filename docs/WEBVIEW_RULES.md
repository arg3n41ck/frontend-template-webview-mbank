# Общие WebView-правила

Это базовые engineering safeguards, а не выдуманный универсальный native protocol. Для host-specific требований читайте `docs/NATIVE_HOST.md`. Нет подтверждённого контракта — остановитесь перед native side effect и запросите его.

## Keyboard / viewport

- Не считать 100vh/100dvh гарантией доступности input при клавиатуре. Один scroll container, один владелец компенсации, `min-height: 0` у flex descendants.
- `WebviewShell` поддерживает policy `visual-viewport` или `native`. Feature detection вместо iOS-only UA heuristics. Resize/scroll/orientation listeners с cleanup, не blur/remount form на resize.
- Visual viewport height/offset и scale — разные данные. Zoom не считать клавиатурой. Не smooth-scroll на каждый resize. Не смешивать keyboard padding с уменьшением viewport height.
- Input в sheet/dialog проверять отдельно: primitive overlay управляет focus/scroll lock; shell не должен скроллить скрытый background вместо overlay.
- Проверять IME show/hide, input/textarea/autofill, аппаратную/floating keyboard, landscape, large text, nested overlays и Android hardware back.
- `visualViewport` отсутствует — CSS fallback, не crash. Host может resize/pan viewport иначе: device proof обязателен.

## Safe area / scroll

- Владелец inset явно указан: web или native. Не складывать native padding + CSS env для одной области. Учитывать все четыре стороны, landscape, footer CTA и native header.
- CSS env может быть нулём из-за engine или расположения WebView: это не доказательство отсутствия notch.
- Только один основной scroller; без global touchmove preventDefault, фикса body scroll после каждого render и DOM effects в reducer.
- shadcn/Radix — единственный overlay lock owner; не добавлять параллельный body lock. Проверить восстановление focus/scroll после close и unmount.
- Pull-to-refresh только по согласованному сценарию. Не конфликтует с native gesture, не делает полный reload с потерей draft и не повторяет mutation.

## Navigation / lifecycle

- Back priority: dismiss top overlay -> router history -> согласованное native close/root fallback. Не регистрировать неизвестный host callback и не закрывать дважды.
- Проверять direct link/subpath/reopen/empty history, unsaved form, gesture + кнопка back.
- Generic starter не имеет универсального native back subscriber. При подключении host adapter согласовать callback и cleanup отдельно.
- Browser visibility/reconnect не всегда равно native resume. Не придумывать resume events; invalidation только нужных stale queries, не reset всей формы.
- Новый вход, продолжение старой WebView и уничтоженный процесс различаются. sessionStorage не доказывает lifecycle. Изолировать старые requests/callbacks от новой сессии.

## Bridge / security

- Feature-код использует shared adapter, не raw window/Flutter/message handler. Проверять availability/version/envelope и payload; errors типизированы, failure не становится success.
- Общий helper повторяет только discovery до первого invoke. Три попытки означают три проверки всего. **Не replay уже вызванной команды**, включая timeout и bridgeUnavailable response.
- Timeout/AbortSignal прекращает JS ожидание, не отменяет уже начавшийся native эффект. Платёжный outcome неизвестен — сначала серверная сверка, не второй платёж.
- Origins/capabilities/nonce проверяет native. TS/front validation не защищает native от чужого JS/frame. URLs: parsed scheme + exact allowlist, без startsWith; внешние сайты не открывать в trusted bridge context.
- Production не принимает mock-переключатели через URL. Development demo и реально выполненная операция явно различаются.
- Никаких secrets в URL state, query keys, analytics, Sentry errors, screenshots, logs и wiki. Не отправлять raw bridge error.details.
- File/camera/share/PDF/download permissions — host capability, не гарантируются HTML attributes. MIME/size/server validation, cancel/denied states и objectURL cleanup обязательны.
- Не включать произвольный file:// доступ, universal file access, eval или arbitrary command execution ради исправления интеграции.

## API / async

- QueryClient стабильный; server data только в Query cache. Query keys содержат влияющие filters/user/session/locale, не token. `signal` передаётся в Axios.
- Default retry отключён; opt-in safe GET retries по контракту. Mutations, payments и offline queue не replay без backend idempotency contract.
- 401 refresh opt-in через injected session callbacks: single-flight, один replay, failure завершает session. Shared не импортирует Auth module.
- Client headers merge, один error notification owner. HTTP cancel/session change не отображать как неизвестный server error.
- Session reset: version increment, cancelQueries, clear cache. Дождаться reset до включения queries новой сессии; не начинать новую session во время cleanup старой. Не сохранять приватный cache в localStorage по умолчанию.
- Refresh cookie/endpoint должен быть подтверждён backend. Нельзя пытаться читать HttpOnly cookie или переносить refresh secret в JS без необходимости.

## UI / accessibility / deploy

- Semantic form, labels, accessible names, focus restoration/trap, visible focus, readable font, touch targets, reduced motion и долгие labels.
- Generic не запрещает zoom. Host-specific исключение документировать отдельно с accessibility risk.
- Только semantic palette tokens, стандартные Lucide icons и один primitive engine.
- SPA fallback и Vite basepath на сервере; HTML Cache-Control и immutable versioned assets. Meta tags не заменяют HTTP headers. Не auto-reload loop при missing chunk, особенно посреди оплаты.
- Mock/browser smoke не означает native-ready. Запись device evidence включает OS, WebView/WKWebView engine, app build, inset policy, scenario/result.

## Первичные источники

- [Android WebView insets](https://developer.android.com/develop/ui/views/layout/webapps/understand-window-insets): поведение менялось по M136/M139/M144, возможны double/ghost padding.
- [Android bridge security](https://developer.android.com/privacy-and-security/risks/insecure-webview-native-bridges).
- [Android file access](https://developer.android.com/privacy-and-security/risks/webview-unsafe-file-inclusion).
- [WebKit safe area](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).
- [Tailwind engine floor](https://tailwindcss.com/docs/compatibility).
- [Query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation).

Источники и host-контракт перепроверять при изменении engine/app minimum; не превращать текущую browser версию в обещание поддержки всех native приложений.
