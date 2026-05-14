# Data Sources API

Data source endpoints manage custom EVM/Substrate sources, runtime status, and logs.

## GET /api/v2/custom-sources

Returns custom data sources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: none.

Response: [CustomSourceListView[]](types.md#customsourcelistview).

## GET /api/v2/custom-sources/create-capability

Checks whether the current account/workspace can create a custom source.

Arguments: none.

Payload: none.

Response: [CustomSourceCreateCapability](types.md#customsourcecreatecapability).

## POST /api/v2/custom-sources/verify

Verifies a custom source config before saving.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `workspace` | Yes | Workspace fullname. |
| `name` | Yes | Source name. |
| `public` | No | Whether the source is proposed/published as public. |
| `kind` | Yes | `evm` or `substrate`. |
| `endpoints` | Yes | Array of RPC/indexer endpoint URLs. |
| `substrate.extensions` | No | Substrate metadata/extensions config. |

Response: [CustomSourceVerifyResult](types.md#customsourceverifyresult).

## GET /api/v2/custom-sources/:fullname

Returns a custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: none.

Response: [CustomSource](types.md#customsource).

## PUT /api/v2/custom-sources/:fullname

Creates or updates a custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. Must match `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `mode` | Yes | `create` or `update`. |
| `name` | Yes | Source name. |
| `fullname` | Yes | Source fullname. |
| `workspace` | Yes | Workspace fullname. |
| `public` | No | Whether the source is public. |
| `kind` | Yes | `evm` or `substrate`. |
| `endpoints` | Yes | Array of endpoint URLs. |
| `batchMaxCount` | No | Runtime batch max count. |
| `blockProcessingConcurrency` | No | Runtime block processing concurrency. |
| `maxQueuedBlocks` | No | Runtime queued block limit. |
| `substrate.extensions` | No | Substrate extensions/types/rpc config. |
| `meta.title` | Yes | Visible title. |
| `meta.description` | No | Description. |
| `meta.icons.default` | No | Icon URL. |

Response: [CustomSource](types.md#customsource).

## DELETE /api/v2/custom-sources/:fullname

Deletes a custom source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## GET /api/v2/custom-sources/:fullname/logs

Returns custom source logs.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |
| `limit` | Query | `50`, `100`, `250`, or `500`. |
| `level` | Query | `info`, `warn`, or `error`. |
| `direction` | Query | `before` or `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: none.

Response: [CustomSourceLogsResult](types.md#customsourcelogsresult).

## POST /api/v2/custom-sources/:fullname/test-status

Checks or simulates a custom source status transition.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | `error` or `recovered`. |

Response: [CustomSourceStatusTestResult](types.md#customsourcestatustestresult).

## POST /api/v2/custom-sources/:fullname/restart

Restarts the custom source runtime.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Response: [CustomSourceRuntimeActionResult](types.md#customsourceruntimeactionresult).

## POST /api/v2/custom-sources/:fullname/reset-lag

Resets custom source lag.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname. |

Payload: `{}`.

Response: [CustomSourceResetLagResult](types.md#customsourceresetlagresult).
