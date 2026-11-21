# Subscriptions API

Subscription endpoints 用于管理 workspace subscriptions、它们的 state、testing 和 delivery logs。

## GET /api/subscriptions

返回当前 workspace/account 的 subscriptions。

参数：无。列表由 backend 按当前 selected workspace 过滤。

Payload: 无。

响应：[SubscriptionView[]](types.md#subscriptionview)。

## POST /api/subscriptions

按 rules 或 template 直接创建 subscription。

参数：无。

Direct trigger subscription payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `template` | 否 | Direct mode 中通常为 `null` 或省略。 |
| `rules` | 是 | Rules 数组。至少需要一条 rule。 |
| `rules[].trigger` | 是 | Trigger fullname。 |
| `rules[].conditions` | 是 | 用于 rule 过滤的 conditions object。 |
| `resources` | 是 | Resource fullnames 数组。 |
| `actions` | 否 | Delivery actions。 |
| `meta.title` | 否 | Subscription title。 |
| `state` | 否 | `on` 或 `off`。 |

Template subscription payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `template.id` | 是 | Template id。 |
| `template.inputs` | 是 | Template input schema 的 values。 |
| `template.topics` | 是 | Selected topic names。 |
| `resources` | 是 | Resource fullnames 数组。 |
| `actions` | 否 | Delivery actions。 |
| `meta.title` | 否 | Subscription title。 |
| `state` | 否 | `on` 或 `off`。 |

响应：[SubscriptionView](types.md#subscriptionview)。

## GET /api/subscriptions/:id

返回 subscription。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Subscription id。 |

Payload: 无。

响应：[SubscriptionView](types.md#subscriptionview)。

## PUT /api/subscriptions/:id

更新 subscription。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Subscription id。 |

Payload: 与 `POST /api/subscriptions` 相同结构。

响应：[SubscriptionView](types.md#subscriptionview)。

## DELETE /api/subscriptions/:id

删除 subscription。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Subscription id。 |

Payload: 无。

响应：`HTTP 204 No Content`，响应体为空。
<!-- api-contract: response=204; body=empty -->

## PUT /api/subscriptions/:id/state

修改 subscription state。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Subscription id。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `state` | 是 | subscription 的目标状态：`on` 或 `off`。 |

响应：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `state` | 是 | subscription 的实际状态：`on`、`off` 或 `blocked`。 |
| `issue` | 否 | 当前状态的问题或状态原因（如有）。 |

Webhook 导致自动阻止投递后，恢复订阅时，该 Webhook 连续未投递的事件计数从零开始。

## POST /api/subscriptions/test

测试现有 subscription 或 draft subscription。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `subscription` | 二选一 | Existing subscription id。 |
| `draft` | 二选一 | 与 `subscription.save.params` 相同结构的 draft payload。 |
| `ruleIndex` | 否 | 要测试的 rule index。 |
| `mode` | 否 | `preview` 或 `send`。 |
| `input` | 否 | Raw source item/test input。 |
| `test.source` | 否 | Source item object。 |
| `test.itemIndex` | 否 | Source item index。 |
| `test.match.hash` | 否 | Existing match hash。 |
| `test.match.index` | 否 | Existing match index。 |

响应：[SubscriptionTestResult](types.md#subscriptiontestresult)。

## GET /api/subscriptions/alerts/history

返回当前 workspace 的 subscription logs。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `limit` | Query | `50`、`100`、`250` 或 `500`。 |
| `status` | Query | `delivered`、`failed`、`rate_limited`、`blocked`。 |
| `direction` | Query | `before` 或 `after`。 |
| `datetime` | Query | Cursor date-time。 |

Payload: 无。

响应：[SubscriptionAlertLog[]](types.md#subscriptionalertlog)。

请参阅 [Webhook 渠道字段](#webhook-channel-fields)。

## GET /api/subscriptions/:id/alerts/history

返回指定 subscription 的 logs。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Subscription id。 |
| `limit` | Query | `50`、`100`、`250` 或 `500`。 |
| `status` | Query | 可选 status 过滤器。 |
| `direction` | Query | `before` 或 `after`。 |
| `datetime` | Query | Cursor date-time。 |

Payload: 无。

响应：[SubscriptionAlertLog[]](types.md#subscriptionalertlog)。

请参阅 [Webhook 渠道字段](#webhook-channel-fields)。

## Webhook 渠道字段 {#webhook-channel-fields}

这两个历史记录响应中的 `channels` 数组都可能在 Webhook 条目中包含以下字段。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `eventId` | `string` | 投递 ID，与 `webhook-id` 请求头相同。 |
| `attempt` | `number` | 尝试次数编号，从 `1` 开始。 |
| `nextAttemptAt` | `string` | 有待处理的 Webhook 重试时，值为 ISO 格式的时间戳。没有待处理的重试时，REST 历史记录路由省略此字段。 |

首条记录的状态反映该事件的所有投递渠道。如果其他渠道投递成功，但 Webhook 投递因可重试的错误而失败，则事件记录的状态为 `delivered`，其中 Webhook 渠道显示 `ok: false`。如果安排了重试，事件记录中 Webhook 渠道的 `reasonCode` 为 `channel.webhook.retry_scheduled`。如果重试队列无法接收投递（队列已满，或排队的投递连同事件数据超过 256 KB），事件记录中的 Webhook 渠道显示 `channel.webhook.retry_queue_full`。

如果后续尝试后重试队列无法接收投递，最终记录的状态为 `failed`，其 Webhook 渠道会显示 `channel.webhook.retry_queue_full`。
