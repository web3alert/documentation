# Triggers API

Trigger endpoints manage trigger definitions, drafts, bulk operations, and test helpers.

## GET /api/v2/triggers

Returns triggers with optional filters.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: none.

Response: [TriggerView[]](types.md#triggerview).

## GET /api/v2/triggers/:fullname

Returns trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: none.

Response: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/v2/triggers/:fullname

Creates or fully saves trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Must match `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Trigger name inside project. |
| `fullname` | Yes | Trigger fullname. |
| `project` | Yes | Project fullname. |
| `workspace` | Yes | Workspace fullname. |
| `backend` | Yes | Backend object. Usually `{ type: "sdk", trigger, values }`. |
| `inputs` | Yes | Input schema. |
| `meta.title` | Yes | Visible title. |
| `meta.description` | No | Description. |
| `defaults` | No | Notification defaults. |
| `output` | No | Legacy output schema. |
| `triggerSpec` | No | Source matching spec or `null`. |
| `providers` | No | Array of provider definitions. |
| `filtersSchema` | No | Optional filters schema. |
| `outputSchema` | No | Human/raw output schema. |
| `transform` | No | JavaScript transform or `null`. |
| `activation` | No | JavaScript activation condition or `null`. |
| `executionPolicy` | No | Runtime limits override object or `null`. |
| `status` | No | `{ status, issue, source, updatedAt }`. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |

Response: [TriggerDraftView](types.md#triggerdraftview).

## PATCH /api/v2/triggers/:fullname

Partially updates trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `set` | One of | Object with dotted paths and values to set. |
| `unset` | One of | Array of dotted paths to remove. |
| `dryRun` | No | If `true`, validate patch without saving. |

Response: [TriggerPatchResult](types.md#triggerpatchresult).

## DELETE /api/v2/triggers/:fullname

Deletes trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## POST /api/v2/triggers/patch

Bulk patch for several triggers.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | Yes | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | No | Validate without saving. |

Response: [TriggerBulkPatchResult](types.md#triggerbulkpatchresult).

## POST /api/v2/triggers/remove

Bulk remove for several triggers.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | Yes | Array of trigger fullnames. |
| `dryRun` | No | Validate without deleting. |

Response: [TriggerBulkRemoveResult](types.md#triggerbulkremoveresult).

## GET /api/v2/triggers/:fullname/draft

Returns trigger draft view.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: none.

Response: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/v2/triggers/:fullname/draft

Saves trigger draft.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/v2/triggers/:fullname`.

Response: [TriggerDraftView](types.md#triggerdraftview).

## POST /api/v2/triggers/:fullname/draft/validate

Validates trigger draft without final save.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

Response: [TriggerValidationResult](types.md#triggervalidationresult).

## POST /api/v2/triggers/preview

Previews transform/providers output without saving trigger.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | Yes | Provider definitions. |
| `transform` | Yes | JavaScript transform object. |
| `input` | Yes | Source item/input for preview. |
| `inputs` | No | Trigger input values. |
| `outputSchema` | No | Output schema used for formatting. |

Response: [TriggerPreviewResult](types.md#triggerpreviewresult).

## POST /api/v2/triggers/test

Tests trigger definition on sample source item.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Yes | Source matching spec. |
| `providers` | Yes | Provider definitions. |
| `transform` | Yes | JavaScript transform. |
| `outputSchema` | Yes | Output schema. |
| `activation` | No | Activation condition. |
| `inputs` | No | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

Response: [TriggerTestResult](types.md#triggertestresult).

## POST /api/v2/triggers/test-block

Tests trigger on a specific block.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Yes | Source matching spec. |
| `providers` | Yes | Provider definitions. |
| `transform` | Yes | JavaScript transform. |
| `outputSchema` | Yes | Output schema. |
| `block` | Yes | Block number. |
| `itemIndex` | No | Source item index inside block. |
| `activation` | No | Activation condition. |
| `filtersSchema` | No | Filters schema. |
| `inputs` | No | Input values. |

Response: [TriggerTestResult](types.md#triggertestresult).

## POST /api/v2/triggers/providers/test

Tests one provider.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Yes | Source matching spec. |
| `provider` | Yes | Provider definition. |
| `project` | No | Project fullname. |
| `workspace` | No | Workspace fullname. |
| `templateValues` | No | Template values for provider placeholders. |

Response: [ProviderTestResult](types.md#providertestresult).

## GET /api/v2/triggers/runtime-sources

Returns runtime data sources available to trigger builder.

Arguments: none.

Payload: none.

Response: [RuntimeSource[]](types.md#runtimesource).

## POST /api/v2/triggers/find-latest-block

Finds latest block/test input for trigger testing.

Arguments: none.

Payload: trigger/source-specific search object.

Response: [LatestBlockResult](types.md#latestblockresult).

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
