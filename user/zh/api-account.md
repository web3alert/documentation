# Account API

Account endpoints 用于处理当前用户、metadata、avatar 和选中的 workspace。

除 token 在 external auth flow 后创建的情况外，所有 endpoints 都需要 `Authorization: Bearer <token>`。

## POST /api/v1/token

为已认证的 identity 创建或返回 API token。

参数：无 path/query 参数。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `app` | 是 | Auth app/provider 名称。 |
| `credentials` | 是 | Provider 专用 credentials 对象。 |

响应：[TokenResponse](types.md#tokenresponse)。

## GET /api/me

返回当前 account、identity、tier、memberships 和选中的 workspace。

参数：无。

Payload: 无。

响应：[Me](types.md#me)。

## DELETE /api/v1/me

删除当前 account。

参数：无。

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## PUT /api/v1/me/meta

更新 user metadata。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `nickname` | 否 | 用户 display name，2-80 个字符。 |

响应：[Me](types.md#me)。

## POST /api/v1/me/avatar

上传当前 account avatar。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `filename` | 是 | 原始文件名。 |
| `contentType` | 是 | 图片 MIME type。 |
| `data` | 是 | Base64 图片数据。 |

响应：[AvatarUploadResult](types.md#avataruploadresult)。

## GET /api/v1/me/workspace

返回当前 account 选中的 workspace。

参数：无。

Payload: 无。

响应：[CurrentWorkspaceResponse](types.md#currentworkspaceresponse)。

## POST /api/v1/me/workspace

切换当前 account 选中的 workspace。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `workspace` | 是 | Workspace fullname，或用 `null` 重置选择。 |

响应：[CurrentWorkspaceResponse](types.md#currentworkspaceresponse)。

## GET /api/v1/account/settings

返回 account settings。

参数：无。

Payload: 无。

响应：[AccountSettings](types.md#accountsettings)。

## POST /api/v1/account/settings

保存 account settings。

参数：无。

Payload: settings 对象。具体 fields 集合取决于当前 account settings UI 版本。

响应：[AccountSettings](types.md#accountsettings)。
