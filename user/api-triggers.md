# Triggers API

Trigger endpoints управляют trigger definitions, drafts, bulk operations and test helpers.

## GET /api/v2/triggers

Возвращает triggers с optional filters.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: нет.

Response: array of trigger views.

## GET /api/v2/triggers/:fullname

Возвращает trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: нет.

Response: trigger object.

## PUT /api/v2/triggers/:fullname

Создает или полностью сохраняет trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Должен совпадать с `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Trigger name внутри project. |
| `fullname` | Да | Trigger fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `backend` | Да | Backend object. Обычно `{ type: "sdk", trigger, values }`. |
| `inputs` | Да | Input schema. |
| `meta.title` | Да | Видимое название. |
| `meta.description` | Нет | Описание. |
| `defaults` | Нет | Notification defaults. |
| `output` | Нет | Legacy output schema. |
| `triggerSpec` | Нет | Source matching spec или `null`. |
| `providers` | Нет | Array of provider definitions. |
| `filtersSchema` | Нет | Optional filters schema. |
| `outputSchema` | Нет | Human/raw output schema. |
| `transform` | Нет | JavaScript transform or `null`. |
| `activation` | Нет | JavaScript activation condition or `null`. |
| `executionPolicy` | Нет | Runtime limits override object or `null`. |
| `status` | Нет | `{ status, issue, source, updatedAt }`. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |

Response: saved trigger.

## PATCH /api/v2/triggers/:fullname

Частично изменяет trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `set` | One of | Object with dotted paths and values to set. |
| `unset` | One of | Array of dotted paths to remove. |
| `dryRun` | Нет | If `true`, validate patch without saving. |

Response: patched trigger or dry-run result.

## DELETE /api/v2/triggers/:fullname

Удаляет trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: нет.

Response: operation result.

## POST /api/v2/triggers/patch

Bulk patch для нескольких triggers.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | Да | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | Нет | Validate without saving. |

Response: bulk patch result.

## POST /api/v2/triggers/remove

Bulk remove для нескольких triggers.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | Да | Array of trigger fullnames. |
| `dryRun` | Нет | Validate without deleting. |

Response: bulk remove result.

## GET /api/v2/triggers/:fullname/draft

Возвращает draft view trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: нет.

Response: trigger draft.

## PUT /api/v2/triggers/:fullname/draft

Сохраняет draft trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/v2/triggers/:fullname`.

Response: saved draft.

## POST /api/v2/triggers/:fullname/draft/validate

Проверяет draft trigger без финального сохранения.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

Response: validation result with issues.

## POST /api/v2/triggers/preview

Preview transform/providers output without saving trigger.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | Да | Provider definitions. |
| `transform` | Да | JavaScript transform object. |
| `input` | Да | Source item/input for preview. |
| `inputs` | Нет | Trigger input values. |
| `outputSchema` | Нет | Output schema used for formatting. |

Response: preview result.

## POST /api/v2/triggers/test

Тестирует trigger definition на sample source item.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `providers` | Да | Provider definitions. |
| `transform` | Да | JavaScript transform. |
| `outputSchema` | Да | Output schema. |
| `activation` | Нет | Activation condition. |
| `inputs` | Нет | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

Response: test result with raw/human output and issues.

## POST /api/v2/triggers/test-block

Тестирует trigger на конкретном block.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `providers` | Да | Provider definitions. |
| `transform` | Да | JavaScript transform. |
| `outputSchema` | Да | Output schema. |
| `block` | Да | Block number. |
| `itemIndex` | Нет | Source item index inside block. |
| `activation` | Нет | Activation condition. |
| `filtersSchema` | Нет | Filters schema. |
| `inputs` | Нет | Input values. |

Response: block test result.

## POST /api/v2/triggers/providers/test

Тестирует один provider.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `provider` | Да | Provider definition. |
| `project` | Нет | Project fullname. |
| `workspace` | Нет | Workspace fullname. |
| `templateValues` | Нет | Template values for provider placeholders. |

Response: provider output or error details.

## GET /api/v2/triggers/runtime-sources

Возвращает runtime data sources, доступные для trigger builder.

Arguments: нет.

Payload: нет.

Response: runtime source list.

## POST /api/v2/triggers/find-latest-block

Находит latest block/test input для trigger testing.

Arguments: нет.

Payload: trigger/source-specific search object.

Response: latest block/test input result.

## Trigger Spec

`triggerSpec` describes source matching.

Supported variants:

| Type | Required fields | Optional fields |
| --- | --- | --- |
| `evm_log` | `type`, `dataSource` | `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput` |
| `evm_transaction` | `type`, `dataSource` | `testInput` |
| `substrate_event` | `type`, `dataSource` | `pallet`, `event`, `testInput` |
| `timer` | `type`, `interval` | `testInput` |

## Provider Definition

Each provider has `id`, `type`, optional `weight`, optional `timeoutMs`, and optional `outputSchema`.

Supported provider types:

| Type | Required fields | Main optional fields |
| --- | --- | --- |
| `http` | `id`, `type`, `url` | `method`, `headers`, `queryParams`, `body` |
| `graphql` | `id`, `type`, `url`, `query` | `headers`, `variables` |
| `rpc` with `transport: "endpoint"` | `id`, `type`, `url`, `method` | `headers`, `params`, `body` |
| `rpc` with `transport: "source"` | `id`, `type`, `transport`, `method` | `params` |
| `substrate_storage` | `id`, `type`, `module`, `entry` | `source`, `args`, `block` |
| `evm_read` | `id`, `type`, `contract`, `method`, `abiFragment` | `source`, `abiContract`, `args` |
| `state_window` | `id`, `type`, `dedupeBy`, `value`, `keepLast` | `partitionBy`, `valueType`, `aggregate` |
| `javascript` | `id`, `type`, `source` | `variables` |
