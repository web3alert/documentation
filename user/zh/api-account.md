# Account API

Account endpoints 用于处理当前用户、metadata、avatar 和选中的 workspace。

需要身份验证的请求请发送 Bearer 凭据。管理密钥和更改会话需要账户会话令牌。下文标明了公开的登录和认领端点。

## POST /api/token

`POST /api/token` 无需现有的 `Authorization: Bearer <token>` header。所选 `app` 对应的 provider-specific `credentials` 用于验证 identity。

每次成功请求都会创建一个新的持久化 Bearer token；不会复用或返回之前签发的 token。identity 首次成功登录时，服务还可能创建 account 和 workspace。

<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent; first-login=may-provision-account-workspace -->

参数：无 path/query 参数。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `app` | 是 | Auth app/provider 名称。 |
| `credentials` | 是 | Provider 专用 credentials 对象。 |
| `claim` | 否 | 钱包账户认领链接中的令牌，用于 Telegram 或 Google 登录。 |

响应：[TokenResponse](types.md#tokenresponse)。

请求示例（特意不包含 `Authorization` header）：

```http
POST /api/token
Content-Type: application/json

{
  "app": "google",
  "credentials": {
    "credential": "<provider-issued-credential>"
  }
}
```

响应示例：

```json
{
  "token": "<new-bearer-token>"
}
```

Provider credentials 和返回的 token 都是敏感信息。仅通过 HTTPS 发送，切勿记录到日志、公开或提交到代码仓库。

带 `claim` 登录成功后，该登录方式会关联到钱包账户，链接随即失效，并会签发该账户的会话令牌。若登录方式已关联其他账户，则返回 `409 login_already_linked`，链接仍有效。认领令牌无效时返回 `404 claim_not_found`，且不会创建账户。

认领账户后，此前通过钱包签发的密钥仍然有效。登录后，请在 [Agents 页面](https://web3alert.io/agents)检查密钥并撤销不想保留的密钥。

## DELETE /api/token

撤销用于验证此请求的 token。

需要账户会话令牌。在应用中退出登录时，应用会对当前浏览器会话调用此操作。

发送请求时请省略 path/query 参数和请求体。额外参数无法指定其他 token 或 account。

```http
DELETE /api/token
Authorization: Bearer YOUR_SESSION_TOKEN
```

成功时，server 返回 `204 No Content`，响应体为空。即使 account 已达到 API 请求限额，此 endpoint 仍可用。

## DELETE /api/tokens

撤销已通过身份验证的 account 的所有 tokens，包括此请求使用的 token。

需要账户会话令牌。使用 `DELETE /api/keys/:id` 单独撤销智能体密钥。

发送请求时请省略 path/query 参数和请求体。额外参数无法指定其他 token 或 account。

```http
DELETE /api/tokens
Authorization: Bearer YOUR_SESSION_TOKEN
```

成功时，server 返回 `204 No Content`，响应体为空。即使 account 已达到 API 请求限额，此 endpoint 仍可用。

## GET /api/me

返回当前 account、identity、tier、memberships 和选中的 workspace。

使用密钥时需要 `read` 权限。响应会附带 `key`，包含 `id`、`name`、`scopes`、`monthlyCapEur`、`spentThisMonthEur` 和 `expiresAt`。`memberships` 只包含密钥绑定的工作区。

参数：无。

Payload: 无。

响应：[Me](types.md#me)。

### 套餐限制 {#me-limits}

响应还包含已认证账户的套餐限制 `limits`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | 账户在所有工作区创建的非 Free 项目启用订阅的账户级上限。Free 项目的订阅不计入上限。`null` 表示无上限。 |
| `limits.canRunTests` | `boolean` | 套餐是否允许运行测试。 |
| `limits.alertHistory` | `object \| null` | 告警历史限制。`null` 表示套餐不包含告警历史。 |
| `limits.alertHistory.retentionDays` | `number` | 告警历史的保留天数。 |
| `limits.alertHistory.maxRecords` | `number \| null` | 最多保留的记录数。`null` 表示记录数没有上限。 |

## POST /api/keys

当前工作区的任何成员都能创建密钥。密钥沿用账户在该工作区的角色。

需要账户会话令牌。创建绑定到当前工作区的密钥。发送 `{ name, scopes, monthlyCapEur?, expiresInDays? }`。名称为 1–64 个字符。包含 `read`，可选 `manage` 和 `spend`。支出上限为 0–10,000 欧元，最多两位小数。有效期可以是 30、90 或 365 天。省略这两个可选字段或传 `null` 即不限制对应项目。

返回 `201` 和 `{ key, secret }`。请复制 `secret`，它只在该响应中显示。

## GET /api/keys

需要账户会话令牌。返回账户在所有工作区的 `{ keys }`，按从新到旧排序，包括已撤销的密钥。每个密钥包含工作区、权限、上限、本月支出、有效期、状态和 `connectedBy`。

## PATCH /api/keys/:id

需要账户会话令牌。发送 `{ name?, monthlyCapEur? }` 修改账户的密钥。用 `null` 清除上限。返回 `{ key }`。若账户无法访问该密钥，则返回 `404`。

## DELETE /api/keys/:id

需要账户会话令牌。撤销该账户的密钥。成功或重复撤销均返回 `204 No Content`。若账户无法访问该密钥，则返回 `404`。

## POST /api/agent/siwe/nonce

公开。无需请求体。返回 `{ nonce, issuedAt, expiresAt }`。nonce 有效期为 10 分钟，且只能使用一次。

nonce 和验证端点共用边缘层的每 IP 限流，每秒 1 次请求，突发容量为 10。边缘层的 `429` 响应没有 API 的 `signup_limited` 响应体。请遵循 `Retry-After`，若签署的消息已失效，请获取新的 nonce。

## POST /api/agent/siwe/verify

公开。发送由以太坊外部账户（EOA）签署的 `{ message, signature }`。使用版本为 `1` 的 EIP-4361 消息，包含返回的 nonce、域名 `web3alert.io`、同源 URI，以及与服务器时间相差不超过五分钟的 `issuedAt`。接受任意链 ID。

返回 `{ account: { id, created }, key, secret, claimUrl }`。首次登录会创建 Free 账户和工作区。每次成功登录都会签发具有全部权限的新密钥，无上限和有效期。使用 `secret` 作为 Bearer 凭据。验证会在创建账户或没有有效链接时签发认领链接。若已有有效链接，`claimUrl` 为 `null`。可调用 `POST /api/agent/claim-link` 替换链接。

账户由用户通过 Telegram 或 Google 认领后，钱包登录会返回 `403 account_claimed`，且不再签发密钥或链接。请向该用户索取智能体密钥。

验证失败返回 `401 invalid_siwe`。每个 IP 在滚动一小时内最多创建 10 个账户，所有 IP 在滚动一天内最多创建 200 个账户。达到限制时返回 `429 signup_limited` 和 `Retry-After`。参见 [SIWE 示例](agents.md)。

## POST /api/agent/claim-link

需要有 `manage` 权限的智能体密钥。无需请求体。返回 `{ claimUrl, expiresAt }`。新链接会替换旧链接，有效期为七天。使用会话令牌会返回 `403 agent_key_required`。已关联 Telegram 或 Google 时返回 `409 already_claimed`。

## GET /api/agent/claims/:token

持有链接即可访问。返回 `{ wallet, account: { name }, createdAt, expiresAt }`。未知、已过期、已替换或已使用的链接均返回 `404 claim_not_found`。可通过 `POST /api/token` 的可选字段 `claim` 完成认领。

## DELETE /api/me

删除当前 account。

参数：无。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## PUT /api/me/meta

更新 user metadata。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `nickname` | 是 | 用户 display name，2-80 个字符。保存并返回前会去除首尾空白。 |

响应：HTTP 200 OK。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `nickname` | 是 | 已保存的去除首尾空白后的 nickname。 |

## POST /api/me/avatar

上传当前 account avatar。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `filename` | 是 | 原始文件名。 |
| `contentType` | 是 | 图片 MIME type。 |
| `data` | 是 | Base64 图片数据。 |

响应：[AvatarUploadResult](types.md#avataruploadresult)。

## GET /api/me/workspace

返回当前 account 选中的 workspace。

参数：无。

Payload: 无。

响应：[CurrentWorkspaceResponse](types.md#currentworkspaceresponse)。

## PUT /api/me/workspace

切换当前 account 选中的 workspace。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `workspace` | 是 | Workspace fullname，或用 `null` 重置选择。 |

响应：[CurrentWorkspaceResponse](types.md#currentworkspaceresponse)。

## GET /api/account/settings

返回 account settings。

参数：无。

Payload: 无。

响应：[AccountSettings](types.md#accountsettings)。

## PUT /api/account/settings

保存 account settings。

参数：无。

Payload: settings 对象。具体 fields 集合取决于当前 account settings UI 版本。

响应：[AccountSettings](types.md#accountsettings)。
