# Projects API

Project endpoints 用于管理 marketplace integrations：metadata、visibility/access level、links，以及 uploaded icon/cover images。

## GET /api/projects

返回当前 account 可访问的 projects 列表。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `scope` | Query | Optional scope: `all`, `marketplace`, `backend`. |

Payload: 无。

响应：[ProjectView[]](types.md#projectview)。

## GET /api/projects/create-capability

检查当前 account/workspace 是否可以创建 project。

Arguments: 无。

Payload: 无。

响应：[ProjectCreateCapability](types.md#projectcreatecapability)。

## GET /api/projects/:fullname

按 fullname 返回 project。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: 无。

响应：[ProjectView](types.md#projectview)。

## PUT /api/projects/:fullname

创建或更新 project。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. 必须与 `payload.fullname` 一致。 |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | 是 | workspace 内的 Project name。 |
| `fullname` | 是 | `<workspace>.<name>` 格式的 fullname。 |
| `workspace` | 是 | Workspace fullname. |
| `public` | 是 | Legacy public flag。新代码最好同时传入 `accessLevel`。 |
| `visibility` | 否 | Storage visibility: `public`, `private_link`, `personal`. |
| `accessLevel` | 否 | Product access level: `private`, `public`, `free`. |
| `tags` | 否 | Project tags. |
| `labels` | 否 | Project labels. |
| `meta.title` | 是 | project 的可见名称。 |
| `meta.description` | 是 | 完整描述。 |
| `meta.shortDescription` | 否 | 短描述。 |
| `meta.links` | 否 | `{ title, url }` useful links 数组。 |
| `meta.icon` | 否 | Icon URL。可以是 uploaded asset URL。 |
| `meta.avatar` | 否 | Avatar URL。通常与 `icon` 相同。 |
| `meta.cover` | 否 | Cover URL。可以是 uploaded asset URL。 |

响应：[ProjectView](types.md#projectview)。

## DELETE /api/projects/:fullname

删除 project。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## GET /api/projects/by-link/:token

通过 access link 打开 private project。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Access link token. |

Payload: 无。

响应：[ProjectView](types.md#projectview)。

## POST /api/projects/:fullname/access-links

为 private project 创建 access link。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `maxUsages` | 否 | Maximum link usages. |
| `expiresAt` | 否 | Expiration date-time. |

响应：[ProjectAccessLink](types.md#projectaccesslink)。

## POST /api/projects/:fullname/assets/images

为 `icon` 或 `cover` 上传 project image。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | 是 | Original filename. |
| `contentType` | 是 | 图片 MIME type。 |
| `data` | 是 | Base64 image data. |
| `target` | 是 | `icon` 或 `cover`。 |

响应：[ProjectImageUploadResult](types.md#projectimageuploadresult)。 保存 project 时，这个 URL 会传入 `meta.icon` 或 `meta.cover`。

## DELETE /api/projects/:fullname/images/:asset

删除 uploaded project image。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Asset filename，例如 `icon.png` 或 draft asset name。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。
