# Resources API

Resources endpoints 用于管理 delivery resources 及其公开 setup flows。本页所有路由都使用规范的 `/api` namespace。

Webhook 资源在列表、单个资源视图和 PUT 响应中包含 `signing: { enabled: boolean, createdAt: string | null }`。`enabled` 表示是否启用签名。`createdAt` 是当前签名密钥的创建时间，未签名的 Webhook 则为 `null`。

将项目转移到另一个工作区时，随项目转移的 Webhook 的签名密钥会被删除。这些 Webhook 会返回 `signing.enabled: false`。有权管理新工作区的用户可以为每个转移的 Webhook [生成新密钥](#post-api-resources-fullname-signing-secret)。

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

创建 Webhook 时，响应还会返回一次 `signingSecret`。更新现有资源时只返回资源视图。

## POST /api/resources/:fullname/signing-secret

为未签名的 Webhook 生成签名密钥，或替换现有密钥。请求方必须有权管理该资源所属的工作区。

仅返回一次 `signingSecret`，并返回 ISO 格式的 `createdAt` 时间戳。有关新密钥何时生效，请参阅 [Webhook](webhooks.md)。

以下轮换错误均返回 HTTP `400`，响应体为 `{ "error": { "message": "..." } }` 格式的 JSON。

| 消息 | 返回条件 |
| --- | --- |
| `access denied` | 请求方无权管理该资源所属的工作区。 |
| `resource not found` | 资源不存在。 |
| `not a webhook resource` | 资源不是 Webhook。 |

## DELETE /api/resources/:fullname

删除 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。 |

Payload: 无。

需要账户会话令牌或有 `manage` 权限的密钥，以及资源所在工作区的管理权限。返回 `204 No Content`。删除 Webhook 时，如果同一工作区有启用（`on`）的订阅向它投递，则返回 `409 webhook_in_use`。

以下三个 setup-session endpoints 仅在服务器启用安全 Telegram destination setup 时可用。

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

完成后，服务器把已确认 target 保存到私有 `data`，将 `ready` 设为 `true`，并清空
`remark`。Workspace controller 通过 `destinationSummary` 获得安全的名称、类型和可选
topic；Telegram target id 和私有数据不会出现在该 view 中。展示已配置 destination
时应使用 `destinationSummary`，而不是 `remark`。

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

## PUT /api/inbox

需要账户会话令牌或有 `manage` 权限的智能体密钥，还需要工作区管理权限。无需请求体。返回 `{ fullname, retention: { days, maxEvents } }`。重复调用返回同一收件箱。若完整名称已被其他资源占用，则返回 `409 resource_name_in_use`。

将完整名称用作 `common.builtin.inbox` 订阅操作的 `values.inbox`。应用工作区所有者的套餐，若无所有者则应用调用者的套餐。Free 的两个收件箱端点均返回 `403 not_in_plan`。参见[限制](limits.md)。

## GET /api/events

需要账户会话令牌或有 `read` 权限的智能体密钥、工作区管理权限，以及与创建收件箱相同的付费套餐。查询参数 `after`（不透明游标）和 `limit`（1–500，默认 100）可选。首次读取从保留的最旧事件开始。

返回 `{ events, nextCursor, hasMore, gap }`。每条事件包含 `cursor`、`id`、`receivedAt`、`subscription`、`trigger` 和 `body`。将 `nextCursor` 用作 `after` 以翻页或轮询。空页返回原游标，未提供时返回 `null`。`gap: true` 表示相对该游标有事件超出保留范围。

## GET /api/resources/external/:token

<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->

通过 resource capability 读取 external resource setup 状态。

安全说明：`:token` 是 resource 的长期 bearer capability，不是 Telegram
setup session 中有效期为 15 分钟的一次性 `setupToken`。请将完整 URL
视为 secret：仅通过 HTTPS 传输，不要写入 analytics、应用日志、支持消息，
也不要放入会发送 referrer 的链接。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | Resource 的长期 bearer capability。 |

Payload: 无。

响应：[ExternalResourceView](types.md#externalresourceview)。

## POST /api/resources/external/:token

通过 resource capability 提交 external resource setup payload。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | Resource 的长期 bearer capability。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `transform` | 是 | 对象或 `null`，resource/app-specific transform/setup result。 |

响应：[OperationResult](types.md#operationresult)。
