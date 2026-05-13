# Data Sources API

Data source endpoints управляют custom EVM/Substrate sources, runtime status and logs.

## GET /api/v2/custom-sources

Возвращает custom data sources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: нет.

Response: array of custom sources.

## GET /api/v2/custom-sources/create-capability

Проверяет, может ли текущий account/workspace создать custom source.

Arguments: нет.

Payload: нет.

Response: capability object.

## POST /api/v2/custom-sources/verify

Проверяет custom source config перед сохранением.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `workspace` | Да | Workspace fullname. |
| `name` | Да | Source name. |
| `public` | Нет | Whether source is proposed/published as public. |
| `kind` | Да | `evm` или `substrate`. |
| `endpoints` | Да | Array of RPC/indexer endpoint URLs. |
| `substrate.extensions` | Нет | Substrate metadata/extensions config. |

Response: verification result, metadata and duplicate/public checks.

## GET /api/v2/custom-sources/:fullname

Возвращает custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: нет.

Response: custom source object.

## PUT /api/v2/custom-sources/:fullname

Создает или обновляет custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. Должен совпадать с `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `mode` | Да | `create` или `update`. |
| `name` | Да | Source name. |
| `fullname` | Да | Source fullname. |
| `workspace` | Да | Workspace fullname. |
| `public` | Нет | Whether source is public. |
| `kind` | Да | `evm` или `substrate`. |
| `endpoints` | Да | Array of endpoint URLs. |
| `batchMaxCount` | Нет | Runtime batch max count. |
| `blockProcessingConcurrency` | Нет | Runtime block processing concurrency. |
| `maxQueuedBlocks` | Нет | Runtime queued block limit. |
| `substrate.extensions` | Нет | Substrate extensions/types/rpc config. |
| `meta.title` | Да | Visible title. |
| `meta.description` | Нет | Description. |
| `meta.icons.default` | Нет | Icon URL. |

Response: saved custom source.

## DELETE /api/v2/custom-sources/:fullname

Удаляет custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: нет.

Response: operation result.

## GET /api/v2/custom-sources/:fullname/logs

Возвращает custom source logs.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `level` | Query | `info`, `warn` или `error`. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: нет.

Response: log entries.

## POST /api/v2/custom-sources/:fullname/test-status

Проверяет или имитирует status transition custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Да | `error` или `recovered`. |

Response: status test result.

## POST /api/v2/custom-sources/:fullname/restart

Перезапускает custom source runtime.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Response: restart result.

## POST /api/v2/custom-sources/:fullname/reset-lag

Сбрасывает lag custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Response: reset result.
