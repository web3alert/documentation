# Triggers API

Trigger endpoints gerem trigger definitions, drafts, bulk operations e test helpers.

## GET /api/triggers

Devolve triggers com optional filters.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: nenhum.

Resposta: [TriggerView[]](types.md#triggerview).

## GET /api/triggers/:fullname

Devolve trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname

Cria ou guarda trigger completo.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Sim | Trigger name dentro do project. |
| `fullname` | Sim | Trigger fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `backend` | Sim | Backend object. Normalmente `{ type: "sdk", trigger, values }`. |
| `inputs` | Sim | Input schema. |
| `meta.title` | Sim | Título visível. |
| `meta.description` | Não | Descrição. |
| `defaults` | Não | Notification defaults. |
| `triggerSpec` | Não | Source matching spec ou `null`. |
| `providers` | Não | Array of provider definitions. |
| `filtersSchema` | Não | Optional filters schema. |
| `outputSchema` | Não | Human/raw output schema. |
| `transform` | Não | JavaScript transform ou `null`. |
| `activation` | Não | JavaScript activation condition ou `null`. |
| `executionPolicy` | Não | Runtime limits override object ou `null`. |
| `status` | Não | `{ status, issue, source, updatedAt }`. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PATCH /api/triggers/:fullname

Atualiza trigger parcialmente.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `set` | One of | Object with dotted paths and values to set. |
| `unset` | One of | Array of dotted paths to remove. |
| `dryRun` | Não | If `true`, validate patch without saving. |

Resposta: [TriggerPatchResult](types.md#triggerpatchresult).

## DELETE /api/triggers/:fullname

Elimina trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## POST /api/triggers/patch

Bulk patch para vários triggers.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | Sim | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | Não | Validate without saving. |

Resposta: [TriggerBulkPatchResult](types.md#triggerbulkpatchresult).

## POST /api/triggers/remove

Bulk remove para vários triggers.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | Sim | Array of trigger fullnames. |
| `dryRun` | Não | Validate without deleting. |

Resposta: [TriggerBulkRemoveResult](types.md#triggerbulkremoveresult).

## GET /api/triggers/:fullname/draft

Devolve draft view de trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname/draft

Guarda trigger draft.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/triggers/:fullname`.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## POST /api/triggers/:fullname/draft/validate

Valida trigger draft sem guardar definitivamente.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

Resposta: [TriggerValidationResult](types.md#triggervalidationresult).

## GET /api/triggers/:fullname/logs

Devolve falhas de delivery e eventos de source pressure agregados para um trigger.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Fullname do trigger. |
| `limit` | Query | Número máximo opcional de entradas. |
| `status` | Query | Filtro opcional por estado de delivery. |
| `direction` | Query | Direção de paginação opcional: `before` ou `after`. |
| `datetime` | Query | Timestamp ISO usado com `direction`. |

Payload: nenhum.

A resposta contém dados do trigger, estatísticas de subscriptions e logs normalizados.

## POST /api/triggers/:fullname/reset-test-status

Repõe o estado de teste do trigger para `not_tested`.

Argumentos: `fullname` no path.

Payload: nenhum.

Resposta: [TriggerPatchResult](types.md#triggerpatchresult).

## POST /api/triggers/preview

Valida as definições de providers, executa a activation opcional e os
transforms raw/human sobre o input fornecido, e valida o output resultante. Não
guarda nenhum trigger.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | Sim | Provider definitions. |
| `activation` | Não | Condição de activation JavaScript ou `null`. |
| `transform` | Sim | JavaScript transform object. |
| `input` | Sim | Source item/input for preview. |
| `inputs` | Não | Trigger input values. |
| `providersData` | Não | Valores de providers já calculados para activation e transforms. |
| `outputSchema` | Não | Output schema usada para validar o resultado do preview. |

Resposta: [TriggerPreviewResult](types.md#triggerpreviewresult).

## POST /api/triggers/test

Testa trigger definition em sample source item.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `providers` | Sim | Provider definitions. |
| `transform` | Sim | JavaScript transform. |
| `outputSchema` | Sim | Output schema. |
| `activation` | Não | Activation condition. |
| `inputs` | Não | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

Resposta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/test-block

Testa trigger num block específico.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `providers` | Sim | Provider definitions. |
| `transform` | Sim | JavaScript transform. |
| `outputSchema` | Sim | Output schema. |
| `block` | Sim | Block number. |
| `itemIndex` | Não | Source item index inside block. |
| `activation` | Não | Activation condition. |
| `filtersSchema` | Não | Filters schema. |
| `inputs` | Não | Input values. |

Resposta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/providers/test

Testa um provider.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `provider` | Sim | Provider definition. |
| `project` | Não | Project fullname. |
| `workspace` | Não | Workspace fullname. |
| `templateValues` | Não | Template values for provider placeholders. |

Resposta: [ProviderTestResult](types.md#providertestresult).

## GET /api/triggers/hypercore/actions

Devolve o catálogo de actions HyperCore disponível no trigger builder.

Argumentos: nenhum.

Payload: nenhum.

A resposta contém um array `actions`.

## GET /api/triggers/runtime-sources

Devolve runtime data sources disponíveis para trigger builder.

Arguments: nenhum.

Payload: nenhum.

Resposta: [RuntimeSource[]](types.md#runtimesource).

## GET /api/template-helpers

Devolve metadados públicos dos helpers Handlebars disponíveis nos valores predefinidos dos triggers e nos templates de actions das subscrições. Não requer autenticação.

Argumentos: nenhum.

Payload: nenhum.

A resposta contém um array `handlebars.helpers`. Cada helper tem um `name` único e uma `description`; os helpers de bloco também têm `block: true`, e os helpers com opções nomeadas incluem um array `params` com `name` e `type`.

## POST /api/triggers/find-latest-block

Encontra latest block/test input para trigger testing.

Arguments: nenhum.

Payload: trigger/source-specific search object.

Resposta: [LatestBlockResult](types.md#latestblockresult).

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
