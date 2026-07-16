# Resources API

Resources endpoints 用于管理 delivery resources 及其公开 setup flows。本页所有路由都使用规范的 `/api` namespace。

## GET /api/resources

返回 resources。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Query | 可选 workspace fullname 过滤器。 |
| `project` | Query | 可选 project fullname 过滤器。 |

Payload: 无。

响应：[ResourceView[]](types.md#resourceview)。

## GET /api/resources/:fullname

返回一个 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。 |

Payload: 无。

响应：[ResourceView](types.md#resourceview)。

## PUT /api/resources/:fullname

创建或更新 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。必须与 `payload.fullname` 一致。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Resource 名称。 |
| `fullname` | 是 | Resource fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `project` | 否 | 如果 resource 绑定到 project，则为 project fullname。 |
| `blueprint` | 是 | 定义 setup/action behavior 的 blueprint fullname。 |
| `data` | 否 | Resource-specific data。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |
| `meta.title` | 否 | 可见标题。 |

响应：[ResourceView](types.md#resourceview)。

## DELETE /api/resources/:fullname

删除 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## POST /api/resources/:fullname/setup-sessions

启动一个安全的 Telegram destination setup session。已认证账号必须是该 resource 所属 workspace 的 owner，并且 resource 必须使用 Telegram external blueprint。

每个 resource 同时只能有一个有效 setup session。创建新 session 会将之前的有效 session 标记为 `superseded`，但不会改变 resource 当前的 destination。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname。 |

Payload: 无。

响应：

| 字段 | 说明 |
| --- | --- |
| `id` | 用于查询状态或取消的 setup session ID。 |
| `status` | `pending`。 |
| `setupToken` | 用于打开 Telegram bot setup flow 的一次性 secret。它只在此响应中返回，不应记录到日志或持久化保存。 |
| `expiresAt` | ISO timestamp。Session 和 `setupToken` 会在创建 15 分钟后过期。 |

在 Telegram 确认新 destination 且 session 变为 `completed` 之前，现有 destination 会继续接收 alerts。

## GET /api/resources/:fullname/setup-sessions/:id

返回 Telegram destination setup session 的公开状态。响应永远不会包含 `setupToken`。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname。 |
| `id` | Path | Setup session ID。 |

Payload: 无。

响应：

| 字段 | 说明 |
| --- | --- |
| `id` | Setup session ID。 |
| `resourceFullname` | Resource fullname。 |
| `status` | `pending`、`claimed`、`completed`、`cancelled`、`expired` 或 `superseded`。 |
| `expiresAt` | ISO 过期时间。 |

## DELETE /api/resources/:fullname/setup-sessions/:id

取消有效的 Telegram destination setup session。对于已配置的 resource，取消不会改变当前 destination。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname。 |
| `id` | Path | Setup session ID。 |

Payload: 无。

响应：空的成功响应。

## GET /api/resources/external/:token

通过 token 打开 external resource setup。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | External setup token。 |

Payload: 无。

响应：[ExternalResourceView](types.md#externalresourceview)。

## POST /api/resources/external/:token

发送 external resource setup payload。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | External setup token。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `transform` | 是 | 对象或 `null`，resource/app-specific transform/setup result。 |

响应：[OperationResult](types.md#operationresult)。
