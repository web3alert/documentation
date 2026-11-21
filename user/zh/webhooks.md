# Webhook

## 投递格式

Web3alert 发送带有 JSON 请求体的 HTTP POST 请求。

```json
{
  "id": "evt_0123456789abcdef0123456789abcdef",
  "type": "subscription.event",
  "timestamp": "2026-11-21T12:00:00.000Z",
  "subscription": { "id": "example-subscription-id" },
  "trigger": { "fullname": "example.project.transfer", "name": "Transfer" },
  "header": "Example project",
  "icon": "https://example.com/icon.png",
  "cover": "https://example.com/cover.png",
  "message": "Example alert",
  "links": [{ "text": "View event", "url": "https://example.com/event" }],
  "object": { "amount": "100" }
}
```

| 字段 | 含义 |
| --- | --- |
| `id` | `evt_` 后跟 32 个小写十六进制字符。与 `webhook-id` 相同，每次尝试均使用同一个值。 |
| `type` | 事件投递为 `subscription.event`，测试投递为 `subscription.test`。 |
| `timestamp` | Web3alert 首次准备投递时的 UTC 时间，采用 ISO 8601 格式。每次尝试均使用同一个值。 |
| `subscription.id` | 订阅 ID。 |
| `trigger.fullname`、`trigger.name` | 触发器的完整名称和名称。 |
| `header`、`message` | 项目标题或名称，以及长版或短版告警文本。 |
| `icon`、`cover`、`links` | 提供时包含图片 URL 和带有 `text`、`url` 的链接。 |
| `object` | 事件数据或空对象。 |

| 请求头 | 含义 |
| --- | --- |
| `content-type` | `application/json`。 |
| `webhook-id` | 投递 ID，与请求体中的 `id` 相同。 |
| `webhook-timestamp` | 本次尝试的 Unix 时间戳，单位为秒，以整数字符串发送。 |
| `webhook-signature` | 对于有签名密钥的端点，`v1,<signature>` 包含以 base64 编码的 HMAC-SHA256。 |

## 验证签名

请在解析 JSON 之前使用原始请求体验证签名。将密钥中 `whsec_` 之后的部分做 base64 解码，用解码结果对 `webhook-id.webhook-timestamp.raw-body` 计算 HMAC。使用请求头中的时间戳，若比本地时钟早或晚超过五分钟，则拒绝该请求。也可以使用 Standard Webhooks 库验证这些投递。

示例接收 Node.js `Buffer` 或 Python `bytes` 格式的原始请求体、从小写请求头名称到字符串值的映射，以及端点的签名密钥。仅在验证成功后接受请求。

### Node.js

```js
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyWebhook(rawBody, headers, secret, now = Math.floor(Date.now() / 1000)) {
  const id = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signatures = headers['webhook-signature']
  if (!id || !timestamp || !signatures || !secret.startsWith('whsec_')) return false
  if (!/^[0-9]{1,16}$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 300) return false

  const encodedKey = secret.slice(6)
  const key = Buffer.from(encodedKey, 'base64')
  if (key.length === 0 || key.toString('base64') !== encodedKey) return false

  const digest = createHmac('sha256', key).update(`${id}.${timestamp}.`).update(rawBody)
  const expected = Buffer.from(digest.digest('base64'))
  let valid = false
  for (const entry of signatures.trim().split(/\s+/)) {
    if (!entry.startsWith('v1,')) continue
    const candidate = Buffer.from(entry.slice(3))
    if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) valid = true
  }
  return valid
}
```

### Python

```python
import base64
import hashlib
import hmac
import re
import time
from binascii import Error


def verify_webhook(raw_body, headers, secret, now=None):
    id_ = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signatures = headers.get("webhook-signature")
    if not id_ or not timestamp or not signatures or not secret.startswith("whsec_"):
        return False
    if now is None:
        now = int(time.time())
    if not re.fullmatch(r"[0-9]{1,16}", timestamp) or abs(now - int(timestamp)) > 300:
        return False

    encoded_key = secret[6:]
    try:
        key = base64.b64decode(encoded_key, validate=True)
    except (Error, ValueError):
        return False
    if not key or base64.b64encode(key).decode("ascii") != encoded_key:
        return False

    signed = f"{id_}.{timestamp}.".encode("utf-8") + raw_body
    expected = base64.b64encode(hmac.new(key, signed, hashlib.sha256).digest())
    valid = False
    for entry in signatures.split():
        if entry.startswith("v1,") and hmac.compare_digest(entry[3:].encode("utf-8"), expected):
            valid = True
    return valid
```

### 参考测试向量

要使用 Standard Webhooks 的参考测试向量检查任一示例，请使用下表中的原始请求体，末尾不加换行符。对这组历史测试数据，将 `1614265330` 作为第四个参数（`now`）传入。验证在 Node.js 中应返回 `true`，在 Python 中应返回 `True`。

| 输入 | 值 |
| --- | --- |
| 密钥 | `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` |
| `webhook-id` | `msg_p5jXN8AQM9LWM0D4loKWxJek` |
| `webhook-timestamp` | `1614265330` |
| 原始请求体 | `{"test": 2432232314}` |
| 预期请求头 `webhook-signature` | `v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=` |

## 签名密钥

在应用中创建 Webhook 时，Web3alert 仅显示一次密钥。通过 MCP 工具 `add_webhook` 创建时，也仅返回一次 `signingSecret`。请保存密钥供接收端使用。Web3alert 的密钥以 `whsec_` 开头，后面是用标准 base64 编码的 32 字节数据，带填充字符。

可以在应用中或通过[`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret)生成或轮换密钥。新密钥会在约 10 秒内应用于投递。在此之前，如果已有旧密钥，投递仍使用旧密钥。新密钥生效后，Web3alert 停止使用旧密钥签名。签名功能推出之前创建的端点会继续接收未签名的投递，直到生成密钥。

## 重试

`2xx` 响应表示接收端已接受投递。请尽快响应，因为请求会在 4 秒后超时。遇到 HTTP `429`、任何 `5xx` 响应、请求超时或收到响应前的网络错误（例如连接重置、DNS 或 TLS 故障）时，Web3alert 会重试。其他结果会结束投递。测试投递不会重试。

| 第几次尝试失败后 | 距离下一次尝试的最短等待时间 |
| --- | --- |
| 1 | 5 秒 |
| 2 | 1 分钟 |
| 3 | 10 分钟 |
| 4 | 1 小时 |
| 5 | 6 小时 |

每次投递最多尝试六次。按上述间隔，六次尝试约需 7 小时 11 分钟，另加投递耗时。重试沿用相同的请求体和 `webhook-id`。每次尝试使用当前生效的 URL 和新的 `webhook-timestamp`，并在已配置密钥时由 Web3alert 使用当前密钥签名。投递采用至少一次语义，请使用 `webhook-id` 去重，避免重复处理同一事件。重试不会占用订阅的通知速率额度。

暂停或删除订阅、从订阅中移除 Webhook，或删除 Webhook 资源，都会停止重试。重试队列已满时，失败的投递不会重试，并计为未投递。

## 阻止投递

任何一次尝试收到 HTTP `410 Gone` 都会立即阻止订阅投递。同一订阅和 Webhook 资源连续有五个事件未投递，也会阻止该订阅投递。如果重试次数用尽、无法加入重试队列，或投递被拒绝，该事件计为未投递。URL 无效、签名密钥格式错误，或 HTTP 状态码不属于 `2xx`、`410`、`429` 和 `5xx` 时，投递会被拒绝。等待重试的投递不计入。成功投递一个事件会重置该订阅和 Webhook 的计数。阻止投递时也会将该订阅和 Webhook 的计数清零，恢复订阅后从零开始计数。

要恢复投递，请在应用中、通过 `PUT /api/subscriptions/:id/state` 或用 MCP 工具 `set_subscription_state` 将订阅状态设为 `on`。

## 投递日志

付费套餐会保留投递历史。[订阅历史记录路由](api-subscriptions.md)和 MCP 工具 `get_delivery_log` 会在 Webhook 渠道条目中返回以下字段。

| 字段 | 含义 |
| --- | --- |
| `eventId` | 本次投递的 `webhook-id`。 |
| `attempt` | 尝试次数编号，从 `1` 开始。 |
| `nextAttemptAt` | 安排重试时，首条记录中的 ISO 格式时间戳。 |

| `reasonCode` | 含义 |
| --- | --- |
| `channel.webhook.retry_scheduled` | 第一次尝试失败，已安排重试。 |
| `channel.webhook.rejected` | Webhook 投递被拒绝。 |
| `channel.webhook.gone` | 端点返回了 HTTP `410`。 |
| `channel.webhook.retries_exhausted` | 第六次尝试因可重试错误而失败。 |
| `channel.webhook.retry_queue_full` | 重试队列已满，投递未重试，并计为未投递。 |

尝试因可重试错误而失败，且下一次尝试因重试队列已满而无法排队时，状态为 `failed` 的记录会在 Webhook 渠道条目中包含 `reasonCode: "channel.webhook.retry_queue_full"`。首次尝试失败时记在首条记录中，后续尝试失败时记在最终记录中。

经过重试的投递得出最终结果时，第二条记录会记下该结果，沿用相同的 `eventId`，且仅包含该 Webhook 渠道。成功时记录状态为 `delivered`，被拒绝、重试耗尽或重试队列已满时为 `failed`，收到 HTTP `410` 时为 `blocked`。中途失败后仍会继续重试的尝试不会生成投递日志条目。
