# Data Sources API

Los endpoints Data source gestionan custom EVM/Substrate sources, runtime status y logs.

## GET /api/v2/custom-sources

Devuelve custom data sources.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: ninguno.

Respuesta: [CustomSourceListView[]](types.md#customsourcelistview).

## GET /api/v2/custom-sources/create-capability

Comprueba si el account/workspace actual puede crear un custom source.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [CustomSourceCreateCapability](types.md#customsourcecreatecapability).

## POST /api/v2/custom-sources/verify

Verifica la configuración de custom source antes de guardarla.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `workspace` | Sí | Workspace fullname. |
| `name` | Sí | Source name. |
| `public` | No | Indica si el source se propone/publica como public. |
| `kind` | Sí | `evm` o `substrate`. |
| `endpoints` | Sí | Array de RPC/indexer endpoint URLs. |
| `substrate.extensions` | No | Configuración de Substrate metadata/extensions. |

Respuesta: [CustomSourceVerifyResult](types.md#customsourceverifyresult).

## GET /api/v2/custom-sources/:fullname

Devuelve un custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: ninguno.

Respuesta: [CustomSource](types.md#customsource).

## PUT /api/v2/custom-sources/:fullname

Crea o actualiza un custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. Debe coincidir con `payload.fullname`. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `mode` | Sí | `create` o `update`. |
| `name` | Sí | Source name. |
| `fullname` | Sí | Source fullname. |
| `workspace` | Sí | Workspace fullname. |
| `public` | No | Indica si el source es public. |
| `kind` | Sí | `evm` o `substrate`. |
| `endpoints` | Sí | Array de endpoint URLs. |
| `batchMaxCount` | No | Runtime batch max count. |
| `blockProcessingConcurrency` | No | Runtime block processing concurrency. |
| `maxQueuedBlocks` | No | Runtime queued block limit. |
| `substrate.extensions` | No | Configuración de Substrate extensions/types/rpc. |
| `meta.title` | Sí | Título visible. |
| `meta.description` | No | Descripción. |
| `meta.icons.default` | No | Icon URL. |

Respuesta: [CustomSource](types.md#customsource).

## DELETE /api/v2/custom-sources/:fullname

Elimina un custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## GET /api/v2/custom-sources/:fullname/logs

Devuelve custom source logs.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |
| `limit` | Query | `50`, `100`, `250` o `500`. |
| `level` | Query | `info`, `warn` o `error`. |
| `direction` | Query | `before` o `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: ninguno.

Respuesta: [CustomSourceLogsResult](types.md#customsourcelogsresult).

## POST /api/v2/custom-sources/:fullname/test-status

Comprueba o simula una transición de status del custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `type` | Sí | `error` o `recovered`. |

Respuesta: [CustomSourceStatusTestResult](types.md#customsourcestatustestresult).

## POST /api/v2/custom-sources/:fullname/restart

Reinicia el runtime del custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Respuesta: [CustomSourceRuntimeActionResult](types.md#customsourceruntimeactionresult).

## POST /api/v2/custom-sources/:fullname/reset-lag

Restablece el lag del custom source.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Respuesta: [CustomSourceResetLagResult](types.md#customsourceresetlagresult).
