# Apps, Actions, Blueprints 和 Types API

这些 endpoints 描述 builder/registry layer: apps、actions、blueprints 和 shared types。它们用于 service integrations 以及可复用的 resource/action definitions。

## Apps

### GET /api/apps

返回 apps。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `project` | Query | 可选 project fullname 过滤器。 |
| `workspace` | Query | 可选 workspace fullname 过滤器。 |

Payload: 无。

响应：[AppView[]](types.md#appview)。

### GET /api/apps/:fullname

返回 app。

参数：`fullname` path argument。

Payload: 无。

响应：[AppView](types.md#appview)。

### PUT /api/apps/:fullname

创建或更新 app。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | App name。 |
| `fullname` | 是 | App fullname。 |
| `project` | 是 | Project fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `url` | 是 | App URL。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |

响应：[AppView](types.md#appview)。

### DELETE /api/apps/:fullname

删除 app。

参数：`fullname` path argument。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## Actions

### GET /api/actions

返回 actions。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `project` | Query | 可选 project 过滤器。 |
| `workspace` | Query | 可选 workspace 过滤器。 |

Payload: 无。

响应：[ActionView[]](types.md#actionview)。

### GET /api/actions/:fullname

返回 action。

参数：`fullname` path argument。

Payload: 无。

响应：[ActionView](types.md#actionview)。

### PUT /api/actions/:fullname

创建或更新 action。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Action name。 |
| `fullname` | 是 | Action fullname。 |
| `project` | 是 | Project fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `backend` | 是 | Action backend definition。 |
| `values` | 是 | Action values schema。 |
| `overrides` | 是 | Action 可以覆盖的字段。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |
| `meta` | 是 | Action metadata。 |

响应：[ActionView](types.md#actionview)。

### DELETE /api/actions/:fullname

删除 action。

参数：`fullname` path argument。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## Blueprints

### GET /api/blueprints

返回 blueprints。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `app` | Query | 可选 app fullname 过滤器。 |
| `project` | Query | 可选 project fullname 过滤器。 |
| `workspace` | Query | 可选 workspace fullname 过滤器。 |

Payload: 无。

响应：[BlueprintView[]](types.md#blueprintview)。

### GET /api/blueprints/:fullname

返回 blueprint。

参数：`fullname` path argument。

Payload: 无。

响应：[BlueprintView](types.md#blueprintview)。

### PUT /api/blueprints/:fullname

创建或更新 blueprint。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Blueprint name。 |
| `fullname` | 是 | Blueprint fullname。 |
| `app` | 是 | App fullname。 |
| `project` | 是 | Project fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `type` | 是 | `plain` 或 `external`。 |
| `data` | 否 | Object spec。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |
| `meta.title` | 否 | 可见标题。 |
| `meta.description` | 否 | 描述。 |

响应：[BlueprintView](types.md#blueprintview)。

### DELETE /api/blueprints/:fullname

删除 blueprint。

参数：`fullname` path argument。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## Types

### GET /api/types

返回 shared types。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `project` | Query | 可选 project 过滤器。 |
| `workspace` | Query | 可选 workspace 过滤器。 |
| `status` | Query | `not_tested`、`ready` 或 `broken`。 |
| `pallet` | Query | 可选 pallet 过滤器。 |
| `kind` | Query | `event`、`call`、`transaction` 或 `timer`。 |
| `dataSource` | Query | 可选 data source 过滤器。 |

Payload: 无。

响应：[SharedTypeView[]](types.md#sharedtypeview)。

### GET /api/types/lookup

解析 trigger 关联目录中的动态类型选项。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `trigger` | Query | Trigger fullname。 |
| `ref` | Query | 要解析的 type schema 引用。 |
| `q` | Query | 可选文本搜索。 |
| `value` | Query | 可选精确值。 |
| `limit` | Query | 可选结果数量限制。 |
| 其他字段 | Query | 可选依赖值，例如 `series` 或 `event`。 |

Payload: 无。

响应包含 `ref`、带 `label`、`value` 和可选 `parents` 的规范化 `items`，以及可选的 `nextCursor`。

### GET /api/types/:fullname

返回 shared type。

参数：`fullname` path argument。

Payload: 无。

响应：[SharedTypeView](types.md#sharedtypeview)。

### PUT /api/types/:fullname

创建或更新 shared type。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Shared type collection name。 |
| `fullname` | 是 | Shared type fullname。 |
| `project` | 是 | Project fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `schemas` | 是 | 包含 named type schemas 的对象。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |
| `meta` | 否 | Metadata object。 |

响应：[SharedTypeView](types.md#sharedtypeview)。

### DELETE /api/types/:fullname

删除 shared type。

参数：`fullname` path argument。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。
