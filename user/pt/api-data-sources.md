# Data Sources API

Os endpoints Data source gerem custom EVM/Substrate sources, runtime status e logs.

## GET /api/v2/custom-sources

Devolve custom data sources.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: nenhum.

Resposta: [CustomSourceListView[]](types.md#customsourcelistview).

## GET /api/v2/custom-sources/create-capability

Verifica se o account/workspace atual pode criar um custom source.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [CustomSourceCreateCapability](types.md#customsourcecreatecapability).

## POST /api/v2/custom-sources/verify

Verifica a configuração de custom source antes de guardar.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `workspace` | Sim | Workspace fullname. |
| `name` | Sim | Source name. |
| `public` | Não | Indica se o source é proposto/publicado como public. |
| `kind` | Sim | `evm` ou `substrate`. |
| `endpoints` | Sim | Array de RPC/indexer endpoint URLs. |
| `substrate.extensions` | Não | Configuração de Substrate metadata/extensions. |

Resposta: [CustomSourceVerifyResult](types.md#customsourceverifyresult).

## GET /api/v2/custom-sources/:fullname

Devolve um custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: nenhum.

Resposta: [CustomSource](types.md#customsource).

## PUT /api/v2/custom-sources/:fullname

Cria ou atualiza um custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `mode` | Sim | `create` ou `update`. |
| `name` | Sim | Source name. |
| `fullname` | Sim | Source fullname. |
| `workspace` | Sim | Workspace fullname. |
| `public` | Não | Indica se o source é public. |
| `kind` | Sim | `evm` ou `substrate`. |
| `endpoints` | Sim | Array de endpoint URLs. |
| `batchMaxCount` | Não | Runtime batch max count. |
| `blockProcessingConcurrency` | Não | Runtime block processing concurrency. |
| `maxQueuedBlocks` | Não | Runtime queued block limit. |
| `substrate.extensions` | Não | Configuração de Substrate extensions/types/rpc. |
| `meta.title` | Sim | Título visível. |
| `meta.description` | Não | Descrição. |
| `meta.icons.default` | Não | Icon URL. |

Resposta: [CustomSource](types.md#customsource).

## DELETE /api/v2/custom-sources/:fullname

Elimina um custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## GET /api/v2/custom-sources/:fullname/logs

Devolve custom source logs.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |
| `limit` | Query | `50`, `100`, `250` ou `500`. |
| `level` | Query | `info`, `warn` ou `error`. |
| `direction` | Query | `before` ou `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: nenhum.

Resposta: [CustomSourceLogsResult](types.md#customsourcelogsresult).

## POST /api/v2/custom-sources/:fullname/test-status

Verifica ou simula uma transição de status do custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `type` | Sim | `error` ou `recovered`. |

Resposta: [CustomSourceStatusTestResult](types.md#customsourcestatustestresult).

## POST /api/v2/custom-sources/:fullname/restart

Reinicia o runtime do custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Resposta: [CustomSourceRuntimeActionResult](types.md#customsourceruntimeactionresult).

## POST /api/v2/custom-sources/:fullname/reset-lag

Reinicia o lag do custom source.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Resposta: [CustomSourceResetLagResult](types.md#customsourceresetlagresult).
