# Workspaces API

Workspace endpoints manage workspaces, members, and workspace avatar.

## GET /api/v2/workspaces

Returns list of workspaces available to current account.

Arguments: none.

Payload: none.

Response: [WorkspaceViewShort[]](types.md#workspaceviewshort).

## GET /api/v2/workspaces/:fullname

Returns one workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: none.

Response: [WorkspaceView](types.md#workspaceview).

## PUT /api/v2/workspaces/:fullname

Creates a new workspace or updates existing one.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. Must match `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullname` | Yes | Workspace fullname. |
| `createOnly` | No | If `true`, endpoint returns error if workspace already exists. |
| `resetInvite` | No | Regenerate invite state. |
| `tags` | No | Array of tags. |
| `labels` | No | Object with string labels. |
| `meta.title` | No | Visible workspace title. |
| `meta.avatar` | No | Avatar URL. |

Response: [WorkspaceView](types.md#workspaceview).

## DELETE /api/v2/workspaces/:fullname

Deletes workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## POST /api/v2/workspaces/:fullname/avatar

Uploads workspace avatar.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Yes | Original filename. |
| `contentType` | Yes | Image MIME type. |
| `data` | Yes | Base64 image data. |

Response: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/v2/workspaces/:workspace/acl

Returns list of workspace members/ACL entries.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: none.

Response: [WorkspaceAclEntry[]](types.md#workspaceaclentry).

## POST /api/v2/workspaces/:workspace/acl

Creates invite or ACL entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `invite` | Yes | Invite id/token. |

Response: [WorkspaceAclEntry](types.md#workspaceaclentry).

## PUT /api/v2/workspaces/:workspace/acl/:entryId

Changes member role.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `level` | Yes | One of `owner`, `admin`, `developer`, `user`. |

Response: [WorkspaceAclEntry](types.md#workspaceaclentry).

## DELETE /api/v2/workspaces/:workspace/acl/:entryId

Deletes member/ACL entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: none.

Response: [OperationResult](types.md#operationresult).
