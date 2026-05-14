# Data Sources API

Endpoints Data Sources управляют custom EVM/Substrate sources, runtime-статусом и logs.

## GET /api/v2/custom-sources

Возвращает custom data sources.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [CustomSourceListView[]](types.md#customsourcelistview).

## GET /api/v2/custom-sources/create-capability

Проверяет, может ли текущий account/workspace создать custom source.

Аргументы: нет.

Тело запроса: нет.

Ответ: [CustomSourceCreateCapability](types.md#customsourcecreatecapability).

## POST /api/v2/custom-sources/verify

Проверяет custom source config перед сохранением.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `workspace` | Да | Workspace fullname. |
| `name` | Да | Имя source. |
| `public` | Нет | Признак того, что source предлагается или публикуется как public. |
| `kind` | Да | `evm` или `substrate`. |
| `endpoints` | Да | Массив URL RPC/indexer endpoints. |
| `substrate.extensions` | Нет | Конфигурация Substrate metadata/extensions. |

Ответ: [CustomSourceVerifyResult](types.md#customsourceverifyresult).

## GET /api/v2/custom-sources/:fullname

Возвращает custom source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Тело запроса: нет.

Ответ: [CustomSource](types.md#customsource).

## PUT /api/v2/custom-sources/:fullname

Создает или обновляет custom source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `mode` | Да | `create` или `update`. |
| `name` | Да | Имя source. |
| `fullname` | Да | Source fullname. |
| `workspace` | Да | Workspace fullname. |
| `public` | Нет | Признак public source. |
| `kind` | Да | `evm` или `substrate`. |
| `endpoints` | Да | Массив endpoint URLs. |
| `batchMaxCount` | Нет | Максимальный размер runtime batch. |
| `blockProcessingConcurrency` | Нет | Параллельность обработки блоков в runtime. |
| `maxQueuedBlocks` | Нет | Лимит queued blocks в runtime. |
| `substrate.extensions` | Нет | Конфигурация Substrate extensions/types/rpc. |
| `meta.title` | Да | Видимое название. |
| `meta.description` | Нет | Описание. |
| `meta.icons.default` | Нет | URL иконки. |

Ответ: [CustomSource](types.md#customsource).

## DELETE /api/v2/custom-sources/:fullname

Удаляет custom source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## GET /api/v2/custom-sources/:fullname/logs

Возвращает custom source logs.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `level` | Query | `info`, `warn` или `error`. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Дата и время cursor. |

Тело запроса: нет.

Ответ: [CustomSourceLogsResult](types.md#customsourcelogsresult).

## POST /api/v2/custom-sources/:fullname/test-status

Проверяет или имитирует изменение статуса custom source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `type` | Да | `error` или `recovered`. |

Ответ: [CustomSourceStatusTestResult](types.md#customsourcestatustestresult).

## POST /api/v2/custom-sources/:fullname/restart

Перезапускает custom source runtime.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Тело запроса: `{}`.

Ответ: [CustomSourceRuntimeActionResult](types.md#customsourceruntimeactionresult).

## POST /api/v2/custom-sources/:fullname/reset-lag

Сбрасывает lag custom source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Тело запроса: `{}`.

Ответ: [CustomSourceResetLagResult](types.md#customsourceresetlagresult).
