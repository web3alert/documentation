# Account API

Account endpoints 用于处理当前用户、metadata、avatar 和选中的 workspace。

除 `POST /api/token` 外，所有 Account endpoints 都需要 `Authorization: Bearer <token>`。

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

## GET /api/me

返回当前 account、identity、tier、memberships 和选中的 workspace。

参数：无。

Payload: 无。

响应：[Me](types.md#me)。

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
