# Apps, Actions, Blueprints и Types API

Эти endpoints описывают builder/registry layer: apps, actions, blueprints и shared types. Они используются для service integrations и переиспользуемых resource/action definitions.

## Apps

### GET /api/apps

Возвращает apps.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Опциональный фильтр по project fullname. |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [AppView[]](types.md#appview).

### GET /api/apps/:fullname

Возвращает app.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [AppView](types.md#appview).

### PUT /api/apps/:fullname

Создает или обновляет app.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя app. |
| `fullname` | Да | App fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `url` | Да | App URL. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |

Ответ: [AppView](types.md#appview).

### DELETE /api/apps/:fullname

Удаляет app.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Actions

### GET /api/actions

Возвращает actions.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Опциональный фильтр по project. |
| `workspace` | Query | Опциональный фильтр по workspace. |

Тело запроса: нет.

Ответ: [ActionView[]](types.md#actionview).

### GET /api/actions/:fullname

Возвращает action.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [ActionView](types.md#actionview).

### PUT /api/actions/:fullname

Создает или обновляет action.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя action. |
| `fullname` | Да | Action fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `backend` | Да | Backend definition для action. |
| `values` | Да | Values schema для action. |
| `overrides` | Да | Поля, которые action может переопределять. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta` | Да | Метаданные action. |

Ответ: [ActionView](types.md#actionview).

### DELETE /api/actions/:fullname

Удаляет action.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/blueprints

Возвращает blueprints.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `app` | Query | Опциональный фильтр по app fullname. |
| `project` | Query | Опциональный фильтр по project fullname. |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [BlueprintView[]](types.md#blueprintview).

### GET /api/blueprints/:fullname

Возвращает blueprint.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [BlueprintView](types.md#blueprintview).

### PUT /api/blueprints/:fullname

Создает или обновляет blueprint.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя blueprint. |
| `fullname` | Да | Blueprint fullname. |
| `app` | Да | App fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `type` | Да | `plain` или `external`. |
| `data` | Нет | Object spec. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta.title` | Нет | Видимое название. |
| `meta.description` | Нет | Описание. |

Ответ: [BlueprintView](types.md#blueprintview).

### DELETE /api/blueprints/:fullname

Удаляет blueprint.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Types

### GET /api/types

Возвращает shared types.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Опциональный фильтр по project. |
| `workspace` | Query | Опциональный фильтр по workspace. |
| `status` | Query | `not_tested`, `ready` или `broken`. |
| `pallet` | Query | Опциональный фильтр по pallet. |
| `kind` | Query | `event`, `call`, `transaction` или `timer`. |
| `dataSource` | Query | Опциональный фильтр по data source. |

Тело запроса: нет.

Ответ: [SharedTypeView[]](types.md#sharedtypeview).

### GET /api/types/lookup

Возвращает динамические варианты типов из каталога, связанного с trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `trigger` | Query | Fullname trigger. |
| `ref` | Query | Ссылка на type schema, которую нужно разрешить. |
| `q` | Query | Опциональный текстовый поиск. |
| `value` | Query | Опциональное точное значение. |
| `limit` | Query | Опциональный лимит результатов. |
| Дополнительные поля | Query | Опциональные зависимости, например `series` или `event`. |

Тело запроса: нет.

Ответ содержит `ref`, нормализованные `items` с `label`, `value` и опциональным
`parents`, а также опциональный `nextCursor`.

### GET /api/types/:fullname

Возвращает shared type.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/types/:fullname

Создает или обновляет shared type.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя collection для shared type. |
| `fullname` | Да | Shared type fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `schemas` | Да | Объект с именованными type schemas. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta` | Нет | Объект метаданных. |

Ответ: [SharedTypeView](types.md#sharedtypeview).

### DELETE /api/types/:fullname

Удаляет shared type.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).
