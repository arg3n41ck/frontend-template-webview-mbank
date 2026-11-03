# URL state

Для двух WebView starters URL state принадлежит TanStack Router. `validateListSearch` нормализует owned q/page/limit/order; query hooks получают уже typed values через props от тонкой route boundary.

- Одна система записи одного key. Не добавлять nuqs поверх этих же params. Если отдельная feature требует nuqs — явный adapter и непересекающиеся ownership boundaries.
- Search input uses replace; pagination/navigation deliberate push. При фильтре page reset атомарный.
- `validateListSearch` — пример bounds, не контракт любого API. Сверять allowed limit/order с backend.
- Feature не знает токены/секреты. Не сериализовать auth в фильтры/query keys.
- Проверять malformed/duplicate/default values, Unicode, back/forward, direct links/subpath и сохранение нужных unrelated params. При создании нового feature schema не удалять host launch metadata случайно.
- Demo search локальный; debounce/network behavior реального API добавляется по требованиям, с AbortSignal и race tests.
