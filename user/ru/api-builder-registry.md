# Apps, Actions, Blueprints и Types API

Эти endpoints описывают builder/registry layer: apps, actions, blueprints и shared types. Они используются для service integrations и переиспользуемых resource/action definitions.

## Apps

### GET /api/v2/apps

Возвращает apps.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Опциональный фильтр по project fullname. |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [AppView[]](types.md#appview).

### GET /api/v2/apps/:fullname

Возвращает app.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [AppView](types.md#appview).

### PUT /api/v2/apps/:fullname

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

### DELETE /api/v2/apps/:fullname

Удаляет app.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Actions

### GET /api/v2/actions

Возвращает actions.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Опциональный фильтр по project. |
| `workspace` | Query | Опциональный фильтр по workspace. |

Тело запроса: нет.

Ответ: [ActionView[]](types.md#actionview).

### GET /api/v2/actions/:fullname

Возвращает action.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [ActionView](types.md#actionview).

### PUT /api/v2/actions/:fullname

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

### DELETE /api/v2/actions/:fullname

Удаляет action.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/v2/blueprints

Возвращает blueprints.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `app` | Query | Опциональный фильтр по app fullname. |
| `project` | Query | Опциональный фильтр по project fullname. |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [BlueprintView[]](types.md#blueprintview).

### GET /api/v2/blueprints/:fullname

Возвращает blueprint.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [BlueprintView](types.md#blueprintview).

### PUT /api/v2/blueprints/:fullname

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

### DELETE /api/v2/blueprints/:fullname

Удаляет blueprint.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Types

### GET /api/v2/types

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

### GET /api/v2/types/:fullname

Возвращает shared type.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/v2/types/:fullname

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

### DELETE /api/v2/types/:fullname

Удаляет shared type.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).
