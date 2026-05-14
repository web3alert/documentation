# Data Sources API

Data source endpoints 用于管理 custom EVM/Substrate sources、runtime status 和 logs。

## GET /api/v2/custom-sources

返回 custom data sources。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Query | 可选 workspace fullname 过滤器。 |

Payload: 无。

响应：[CustomSourceListView[]](types.md#customsourcelistview)。

## GET /api/v2/custom-sources/create-capability

检查当前 account/workspace 是否可以创建 custom source。

参数：无。

Payload: 无。

响应：[CustomSourceCreateCapability](types.md#customsourcecreatecapability)。

## POST /api/v2/custom-sources/verify

保存前验证 custom source config。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `workspace` | 是 | Workspace fullname。 |
| `name` | 是 | Source name。 |
| `public` | 否 | Source 是否作为 public 提议/发布。 |
| `kind` | 是 | `evm` 或 `substrate`。 |
| `endpoints` | 是 | RPC/indexer endpoint URLs 数组。 |
| `substrate.extensions` | 否 | Substrate metadata/extensions config。 |

响应：[CustomSourceVerifyResult](types.md#customsourceverifyresult)。

## GET /api/v2/custom-sources/:fullname

返回 custom source。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |

Payload: 无。

响应：[CustomSource](types.md#customsource)。

## PUT /api/v2/custom-sources/:fullname

创建或更新 custom source。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。必须与 `payload.fullname` 一致。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `mode` | 是 | `create` 或 `update`。 |
| `name` | 是 | Source name。 |
| `fullname` | 是 | Source fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `public` | 否 | Source 是否为 public。 |
| `kind` | 是 | `evm` 或 `substrate`。 |
| `endpoints` | 是 | Endpoint URLs 数组。 |
| `batchMaxCount` | 否 | Runtime batch max count。 |
| `blockProcessingConcurrency` | 否 | Runtime block processing concurrency。 |
| `maxQueuedBlocks` | 否 | Runtime queued block limit。 |
| `substrate.extensions` | 否 | Substrate extensions/types/rpc config。 |
| `meta.title` | 是 | 可见标题。 |
| `meta.description` | 否 | 描述。 |
| `meta.icons.default` | 否 | Icon URL。 |

响应：[CustomSource](types.md#customsource)。

## DELETE /api/v2/custom-sources/:fullname

删除 custom source。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## GET /api/v2/custom-sources/:fullname/logs

返回 custom source logs。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |
| `limit` | Query | `50`、`100`、`250` 或 `500`。 |
| `level` | Query | `info`、`warn` 或 `error`。 |
| `direction` | Query | `before` 或 `after`。 |
| `datetime` | Query | Cursor date-time。 |

Payload: 无。

响应：[CustomSourceLogsResult](types.md#customsourcelogsresult)。

## POST /api/v2/custom-sources/:fullname/test-status

检查或模拟 custom source status transition。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `type` | 是 | `error` 或 `recovered`。 |

响应：[CustomSourceStatusTestResult](types.md#customsourcestatustestresult)。

## POST /api/v2/custom-sources/:fullname/restart

重启 custom source runtime。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |

Payload: `{}`。

响应：[CustomSourceRuntimeActionResult](types.md#customsourceruntimeactionresult)。

## POST /api/v2/custom-sources/:fullname/reset-lag

重置 custom source lag。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Custom source fullname。 |

Payload: `{}`。

响应：[CustomSourceResetLagResult](types.md#customsourceresetlagresult)。
