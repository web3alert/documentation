# Triggers API

Trigger endpoints gestionan trigger definitions, drafts, bulk operations y test helpers.

## GET /api/triggers

Devuelve triggers con optional filters.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: ninguno.

Respuesta: [TriggerView[]](types.md#triggerview).

## GET /api/triggers/:fullname

Devuelve trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: ninguno.

Respuesta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname

Crea o guarda trigger completo.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Debe coincidir con `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Sí | Trigger name dentro de project. |
| `fullname` | Sí | Trigger fullname. |
| `project` | Sí | Project fullname. |
| `workspace` | Sí | Workspace fullname. |
| `backend` | Sí | Backend object. Normalmente `{ type: "sdk", trigger, values }`. |
| `inputs` | Sí | Input schema. |
| `meta.title` | Sí | Título visible. |
| `meta.description` | No | Descripción. |
| `defaults` | No | Notification defaults. |
| `triggerSpec` | No | Source matching spec o `null`. |
| `providers` | No | Array of provider definitions. |
| `filtersSchema` | No | Optional filters schema. |
| `outputSchema` | No | Human/raw output schema. |
| `transform` | No | JavaScript transform o `null`. |
| `activation` | No | JavaScript activation condition o `null`. |
| `executionPolicy` | No | Runtime limits override object o `null`. |
| `status` | No | `{ status, issue, source, updatedAt }`. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |

Respuesta: [TriggerDraftView](types.md#triggerdraftview).

## PATCH /api/triggers/:fullname

Actualiza trigger parcialmente.

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

Respuesta: [TriggerPatchResult](types.md#triggerpatchresult).

## DELETE /api/triggers/:fullname

Elimina trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## POST /api/triggers/patch

Bulk patch para varios triggers.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | Sí | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | No | Validate without saving. |

Respuesta: [TriggerBulkPatchResult](types.md#triggerbulkpatchresult).

## POST /api/triggers/remove

Bulk remove para varios triggers.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | Sí | Array of trigger fullnames. |
| `dryRun` | No | Validate without deleting. |

Respuesta: [TriggerBulkRemoveResult](types.md#triggerbulkremoveresult).

## GET /api/triggers/:fullname/draft

Devuelve draft view de trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: ninguno.

Respuesta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname/draft

Guarda trigger draft.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/triggers/:fullname`.

Respuesta: [TriggerDraftView](types.md#triggerdraftview).

## POST /api/triggers/:fullname/draft/validate

Valida trigger draft sin guardado final.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

Respuesta: [TriggerValidationResult](types.md#triggervalidationresult).

## GET /api/triggers/:fullname/logs

Devuelve fallos de delivery y eventos de source pressure agregados para un trigger.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Fullname del trigger. |
| `limit` | Query | Número máximo opcional de entradas. |
| `status` | Query | Filtro opcional por estado de delivery. |
| `direction` | Query | Dirección de paginación opcional: `before` o `after`. |
| `datetime` | Query | Timestamp ISO usado con `direction`. |

Payload: ninguno.

La respuesta contiene datos del trigger, estadísticas de subscriptions y logs normalizados.

## POST /api/triggers/:fullname/reset-test-status

Restablece el estado de test del trigger a `not_tested`.

Argumentos: `fullname` en el path.

Payload: ninguno.

Respuesta: [TriggerPatchResult](types.md#triggerpatchresult).

## POST /api/triggers/preview

Valida las definiciones de providers, ejecuta la activation opcional y los
transforms raw/human sobre el input proporcionado, y valida el output
resultante. No guarda ningún trigger.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | Sí | Provider definitions. |
| `activation` | No | Condición de activation JavaScript o `null`. |
| `transform` | Sí | JavaScript transform object. |
| `input` | Sí | Source item/input for preview. |
| `inputs` | No | Trigger input values. |
| `providersData` | No | Valores de providers ya calculados para activation y transforms. |
| `outputSchema` | No | Output schema usada para validar el resultado del preview. |

Respuesta: [TriggerPreviewResult](types.md#triggerpreviewresult).

## POST /api/triggers/test

Testea trigger definition en sample source item.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sí | Source matching spec. |
| `providers` | Sí | Provider definitions. |
| `transform` | Sí | JavaScript transform. |
| `outputSchema` | Sí | Output schema. |
| `activation` | No | Activation condition. |
| `inputs` | No | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

Respuesta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/test-block

Testea trigger en un block concreto.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sí | Source matching spec. |
| `providers` | Sí | Provider definitions. |
| `transform` | Sí | JavaScript transform. |
| `outputSchema` | Sí | Output schema. |
| `block` | Sí | Block number. |
| `itemIndex` | No | Source item index inside block. |
| `activation` | No | Activation condition. |
| `filtersSchema` | No | Filters schema. |
| `inputs` | No | Input values. |

Respuesta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/providers/test

Testea un provider.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sí | Source matching spec. |
| `provider` | Sí | Provider definition. |
| `project` | No | Project fullname. |
| `workspace` | No | Workspace fullname. |
| `templateValues` | No | Template values for provider placeholders. |

Respuesta: [ProviderTestResult](types.md#providertestresult).

## GET /api/triggers/hypercore/actions

Devuelve el catálogo de actions de HyperCore disponible en el trigger builder.

Argumentos: ninguno.

Payload: ninguno.

La respuesta contiene un array `actions`.

## GET /api/triggers/runtime-sources

Devuelve runtime data sources disponibles para trigger builder.

Arguments: ninguno.

Payload: ninguno.

Respuesta: [RuntimeSource[]](types.md#runtimesource).

## POST /api/triggers/find-latest-block

Encuentra latest block/test input para trigger testing.

Arguments: ninguno.

Payload: trigger/source-specific search object.

Respuesta: [LatestBlockResult](types.md#latestblockresult).

## Trigger Spec

`triggerSpec` describes source matching.

Supported variants:

| Type | Required fields | Optional fields |
| --- | --- | --- |
| `evm_log` | `type`, `dataSource` | `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput` |
| `evm_transaction` | `type`, `dataSource` | `testInput` |
| `substrate_event` | `type`, `dataSource` | `pallet`, `event`, `testInput` |
| `solana_event` | `type`, `dataSource` | `programId`, `event`, `idl`, `testInput` |
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
| `solana_account` | `id`, `type`, `account` | `source`, `idl`, `programId`, `accountName`, `pda` |
| `state_window` | `id`, `type`, `dedupeBy`, `value`, `keepLast` | `partitionBy`, `valueType`, `aggregate` |
| `javascript` | `id`, `type`, `source` | `variables` |
