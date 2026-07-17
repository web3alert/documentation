# Workspaces API

Workspace endpoints 用于管理 workspaces、members 和 workspace avatar。

## GET /api/workspaces

返回当前 account 可访问的 workspaces 列表。

参数：无。

Payload: 无。

响应：[WorkspaceViewShort[]](types.md#workspaceviewshort)。

## GET /api/workspaces/:fullname

返回一个 workspace。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: 无。

响应：[WorkspaceView](types.md#workspaceview)。

## PUT /api/workspaces/:fullname

创建新 workspace 或更新已有 workspace。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. 必须与 `payload.fullname` 一致。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `fullname` | 是 | Workspace fullname. |
| `createOnly` | 否 | 如果为 `true`，当 workspace 已存在时 endpoint 会返回错误。 |
| `resetInvite` | 否 | 重新生成 invite state。 |
| `tags` | 否 | Tags 数组。 |
| `labels` | 否 | String labels 对象。 |
| `meta.title` | 否 | workspace 的可见名称。 |
| `meta.avatar` | 否 | Avatar URL。 |

响应：[WorkspaceView](types.md#workspaceview)。

## DELETE /api/workspaces/:fullname

删除 workspace。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## POST /api/workspaces/:fullname/avatar

上传 workspace avatar。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `filename` | 是 | 原始文件名。 |
| `contentType` | 是 | 图片 MIME type。 |
| `data` | 是 | Base64 图片数据。 |

响应：[AvatarUploadResult](types.md#avataruploadresult)。

## GET /api/workspaces/:workspace/acl

返回 workspace members/ACL entries 列表。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: 无。

响应：[WorkspaceAclEntry[]](types.md#workspaceaclentry)。

## POST /api/workspaces/:workspace/acl

创建 invite 或 ACL entry。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `invite` | 是 | Invite id/token. |

响应：[WorkspaceAclEntry](types.md#workspaceaclentry)。

## PUT /api/workspaces/:workspace/acl/:entryId

修改 member role。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `level` | 是 | `owner`、`admin`、`developer`、`user` 之一。 |

响应：[WorkspaceAclEntry](types.md#workspaceaclentry)。

## DELETE /api/workspaces/:workspace/acl/:entryId

删除 member/ACL entry。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。
