# Dependency baseline

Одна pnpm lockfile, packageManager pnpm@11.21.0. Node 24.x используется для локальных проверок/CI; package engines также допускает совместимый Node 22.18+. Install lifecycle scripts отключены по умолчанию.

React 19 / Vite 8 / TS 6 baseline текущего React-starter. TanStack Query 5 и Router 1, Axios 1.20, RHF 7/Zod 4/resolvers 5 используются, не просто перечислены. shadcn/Radix соответствует исходной family base; второй overlay engine не установлен.

nuqs не установлен: Router уже владелец search. Redux/RTK/react-redux, product iconpack, old deploy, Firebase/Adjust/React Native/Capacitor SDK отсутствуют. Для MBANK events не нужны web SDK: transport предоставляет native host.

`latest` не является правилом обновления. Проверять peer compatibility, changelog, source contracts, frozen lock, audit, typecheck/build и browser/device impact. Major React/Vite/TS/Query/UI обновлять отдельно, не вместе с каждым feature. Версии новой generic/MBANK пары синхронизировать осознанно; другие starters не обновляются автоматически.

Engine floor задаётся Tailwind CSS, JS target его не понижает. Runtime API polyfills не добавлять без конкретной необходимости и минимальных engine versions.

## CLI supply-chain boundary

shadcn CLI не входит в default dependency tree: он притягивал тяжёлые MCP/dev packages и braces advisory без опубликованного patch. `ui:add`/`ui:check` — явный opt-in pnpm dlx с pinned CLI, не install hook. Перед его запуском проверьте CLI advisories и при необходимости выберите исправленную версию. Registry CSS snapshot 4.21.1 хранится локально с MIT notice; это source UI asset, не исполняемый CLI.

Проверенный pnpm 11 config — pnpm-workspace.yaml, не package.json.pnpm. fast-uri override 3.1.9 исправляет известные URI parser advisories; менять/удалять после fresh audit и peer checks.


## Security baseline — 2026-11-03

Перед первым source release свежий audit обнаружил 20 advisories (6 high,
11 moderate, 3 low). Исправления внесены синхронно в оба WebView starter,
без обновления React, TanStack Router/Query и архитектуры приложения.

| Зависимость | Было | Release baseline | Область |
| --- | --- | --- | --- |
| Zod | 4.6.5 | 4.6.6 | runtime validation, patch |
| Vite | 8.2.2 в lock | 8.2.4, exact pin | dev server/build, patch |
| Vitest / mocker | 4.1.11 | 4.1.12 | tests, patch |
| Happy DOM | 20.14.0 | 21.0.4 | test environment, explicit major |
| fast-uri | override 3.1.8 | override 3.1.9 | URI parser, patch |
| source-map-js | 1.2.1 | 1.2.2 | source maps, patch |
| follow-redirects | 1.16.1 | 1.16.2 | HTTP transport, patch |
| seroval | 1.6.8 | 1.7.6 | Router serialization, compatible minor |

Последние три версии закреплены lockfile внутри upstream dependency ranges,
не добавлены как direct dependencies и не требуют новых overrides.
Happy DOM не поставляется в production bundle. Его major обновлён после
явного согласования; hook/native/API regression tests прошли без обхода проверок.
Vite намеренно закреплён на security patch, а не обновлён до другого minor.

Проверены peer/Node constraints, frozen install, verify, browser smoke,
полный и production audit: 0 известных advisories на дату проверки.
Это не гарантия отсутствия будущих уязвимостей и не audit opt-in CLI.

Upstream evidence:
- [Vite 8.2.4](https://github.com/vitejs/vite/releases/tag/v8.2.4).
- [Vitest 4.1.12](https://github.com/vitest-dev/vitest/releases/tag/v4.1.12).
- [Happy DOM 21.0.4](https://github.com/capricorn86/happy-dom/releases/tag/v21.0.4).
- [Zod constrained collections advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
- [source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
- [follow-redirects advisory](https://github.com/advisories/GHSA-mrwp-f3q8-3g9p).
- [fast-uri advisory](https://github.com/advisories/GHSA-w74x-v6f9-j3xg).
- [Seroval advisory](https://github.com/advisories/GHSA-f86p-h4j2-7qgj).
