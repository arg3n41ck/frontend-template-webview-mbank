# Добавление в Template Hub

Локальная подготовка не делает шаблон доступным пользователям npm CLI. Это два независимых репозитория, не вложенные проекты hub.

1. Создать remote для этого starter и согласовать права на распространяемые материалы. Не публиковать secrets/runtime/build cache.
2. Выполнить frozen install, verify, оба audit и browser smoke. Native support объявлять только по device evidence/minimum engine contract.
3. Зафиксировать проверенный source commit и создать immutable release tag `v0.1.0` (либо фактическую следующую версию).
4. Добавить запись в `registry/templates.json` hub с настоящими repository URL, release tag, exact commit SHA и skills из `.ai/workflows.json`. Не подставлять fixture SHA или branch main вместо release.
5. Проверить registry schema, AI contract, clone/generator и selection scenarios; опубликовать каталог только после отдельного разрешения. Не менять CLI code ради очередного типа starter.

Предлагаемые IDs: `webview` и `mbank-webview`. Общие capabilities: web-ui/react/client-rendering/webview; у bank дополнительно mbank. Generic complexity 2, bank 3: обычный WebView запрос не выбирает банк по умолчанию. Bank выбирать только при явном MBANK host. Если host несовместим/неизвестен — уточнить контракт, не обещать поддержку. Browser-only проект выбирает обычный React starter; Next/SSR не подменяется WebView.

Изменение source starter требует нового immutable tag + обновления pin каталога. npm release нужен при изменении CLI/bundled docs или offline fallback, не автоматически после каждой правки starter. Уже созданные проекты не перезаписываются и не обновляются сами.

Общую базу этой пары синхронизировать reviewable changeset в двух repo: Query/Router/native port/layout/docs/common tests. Bank overlay не переносить в generic. При такой синхронизации сравнивать проверенные source contracts, не механически копировать всё дерево.
